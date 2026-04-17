const fs = require("node:fs/promises");
const path = require("node:path");

const {
  defaultAudioBriefings,
  fetchAirtableRecords,
  normalizeAirtableStory,
  publishedStoriesPath,
  readJson,
  writeJson
} = require("./story-utils");

const audioDir = path.join(__dirname, "..", "audio");

function compactText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function buildStoryContext(story, index) {
  const parts = [
    `Story ${index + 1}: ${story.headline}.`,
    `Source: ${story.source}.`,
    `Topic: ${story.topic}.`,
    `Summary: ${compactText(story.summary) || "No summary provided."}`,
    `Why it matters: ${compactText(story.whyItMatters) || "No significance note provided."}`,
    `Relevance: ${story.relevance}.`,
    `Momentum score: ${story.momentum}.`
  ];

  if (story.tags?.length) {
    parts.push(`Tags: ${story.tags.join(", ")}.`);
  }

  return parts.join(" ");
}

function buildFocus(stories) {
  const topics = [...new Set(stories.map((story) => story.topic))].slice(0, 3);
  if (!topics.length) {
    return "Create a short public briefing covering the most important approved stories.";
  }
  return `Create a short public briefing covering the most important approved stories, with emphasis on ${topics.join(", ")}.`;
}

function buildDescription(stories) {
  return `Generated from ${stories.length} approved story record(s) in Airtable.`;
}

async function pollOperation(accessToken, operationName) {
  const maxAttempts = Number(process.env.PODCAST_API_MAX_POLLS || 40);
  const waitMs = Number(process.env.PODCAST_API_POLL_MS || 15000);

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const response = await fetch(`https://discoveryengine.googleapis.com/v1/${operationName}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Operation poll failed with ${response.status}: ${await response.text()}`);
    }

    const payload = await response.json();
    if (payload.done) {
      if (payload.error) {
        throw new Error(`Podcast generation failed: ${JSON.stringify(payload.error)}`);
      }
      return payload;
    }

    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  throw new Error("Podcast generation timed out while polling the long-running operation.");
}

async function downloadPodcast(accessToken, operationName, outputPath) {
  const response = await fetch(
    `https://discoveryengine.googleapis.com/v1/${operationName}:download?alt=media`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "audio/mpeg"
      },
      redirect: "follow"
    }
  );

  if (!response.ok) {
    throw new Error(`Podcast download failed with ${response.status}: ${await response.text()}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, Buffer.from(arrayBuffer));
}

async function fetchApprovedStories() {
  const records = await fetchAirtableRecords({
    params: {
      filterByFormula: "{Status}='Approved'",
      "sort[0][field]": "Date",
      "sort[0][direction]": "desc"
    }
  });

  return records.map(normalizeAirtableStory);
}

async function main() {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const accessToken = process.env.GOOGLE_OAUTH_ACCESS_TOKEN;
  const languageCode = process.env.PODCAST_API_LANGUAGE_CODE || "en-US";
  const length = process.env.PODCAST_API_LENGTH || "SHORT";
  const topStories = Number(process.env.PODCAST_BRIEFING_STORY_LIMIT || 6);

  if (!projectId || !accessToken) {
    throw new Error("Missing Google Podcast API credentials. Set GOOGLE_CLOUD_PROJECT_ID and GOOGLE_OAUTH_ACCESS_TOKEN.");
  }

  const approvedStories = (await fetchApprovedStories()).slice(0, topStories);
  if (!approvedStories.length) {
    throw new Error("No approved Airtable stories found for podcast generation.");
  }

  const today = new Date().toISOString().slice(0, 10);
  const title = `Story briefing ${today}`;
  const payload = {
    podcastConfig: {
      focus: buildFocus(approvedStories),
      length,
      languageCode
    },
    contexts: approvedStories.map((story, index) => ({
      text: buildStoryContext(story, index)
    })),
    title,
    description: buildDescription(approvedStories)
  };

  const createResponse = await fetch(
    `https://discoveryengine.googleapis.com/v1/projects/${projectId}/locations/global/podcasts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  if (!createResponse.ok) {
    throw new Error(`Podcast API request failed with ${createResponse.status}: ${await createResponse.text()}`);
  }

  const operation = await createResponse.json();
  if (!operation.name) {
    throw new Error(`Unexpected podcast API response: ${JSON.stringify(operation)}`);
  }

  await pollOperation(accessToken, operation.name);

  const fileName = `briefing-${today}.mp3`;
  const outputPath = path.join(audioDir, fileName);
  await downloadPodcast(accessToken, operation.name, outputPath);

  const currentFeed = await readJson(publishedStoriesPath, {
    stories: approvedStories,
    audioBriefings: defaultAudioBriefings
  });
  const relativeLink = `audio/${fileName}`;
  const note = `Audio summary generated from ${approvedStories.length} approved story record(s).`;
  const briefing = {
    title,
    duration: length === "SHORT" ? "4-5 min" : "8-10 min",
    note,
    link: relativeLink
  };

  const remainingBriefings = (currentFeed.audioBriefings || []).filter((item) => item.link !== relativeLink);

  await writeJson(publishedStoriesPath, {
    stories: currentFeed.stories || approvedStories,
    audioBriefings: [briefing, ...remainingBriefings].slice(0, 6)
  });

  console.log(`Generated podcast briefing at ${outputPath} and updated ${publishedStoriesPath}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
