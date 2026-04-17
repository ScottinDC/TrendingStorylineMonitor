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
    `Date: ${story.date}.`,
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

function buildGeminiPrompt(stories, minutes) {
  const storyText = stories.map(buildStoryContext).join("\n\n");

  return `
You are writing a public audio explainer for the Trending Storyline Monitor.

Write a concise two-speaker script for a roughly ${minutes}-minute audio briefing.
The tone should sound like a polished public radio explainer: clear, conversational, grounded, and confident.
Do not invent facts beyond the source material below.
Do not include stage directions, music cues, or sound effects.
Keep the script focused on the most important connections across the stories.

Return only valid JSON in this exact shape:
{
  "title": "string",
  "summaryNote": "string",
  "turns": [
    {
      "speaker": "HOST",
      "text": "string"
    },
    {
      "speaker": "GUEST",
      "text": "string"
    }
  ]
}

Rules:
- Use only speakers HOST and GUEST.
- Include between 10 and 18 turns total.
- Each turn should be 1 to 4 sentences.
- "title" should be short and publication-ready.
- "summaryNote" should be one sentence describing the briefing.
- The HOST should guide the conversation and transitions.
- The GUEST should add analysis and context.
- End with a short closing line.

Approved stories:
${storyText}
`.trim();
}

function stripCodeFences(value) {
  const text = String(value || "").trim();
  if (!text.startsWith("```")) {
    return text;
  }
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
}

function parseGeminiJson(value) {
  return JSON.parse(stripCodeFences(value));
}

function normalizeTurns(turns) {
  return (Array.isArray(turns) ? turns : [])
    .map((turn) => ({
      speaker: String(turn.speaker || "").toUpperCase() === "GUEST" ? "GUEST" : "HOST",
      text: compactText(turn.text)
    }))
    .filter((turn) => turn.text);
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

async function generateScript(accessToken, projectId, location, model, stories, minutes) {
  const prompt = buildGeminiPrompt(stories, minutes);
  const response = await fetch(
    `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          responseMimeType: "application/json"
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini script request failed with ${response.status}: ${await response.text()}`);
  }

  const payload = await response.json();
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();

  if (!text) {
    throw new Error(`Gemini returned no script text: ${JSON.stringify(payload)}`);
  }

  const parsed = parseGeminiJson(text);
  const turns = normalizeTurns(parsed.turns);
  if (!turns.length) {
    throw new Error(`Gemini returned no usable turns: ${text}`);
  }

  return {
    title: compactText(parsed.title) || `Story briefing ${new Date().toISOString().slice(0, 10)}`,
    summaryNote: compactText(parsed.summaryNote) || `Audio briefing generated from ${stories.length} approved story record(s).`,
    turns
  };
}

function mapTurnsForMultispeaker(turns) {
  return turns.map((turn) => ({
    speaker: turn.speaker === "GUEST" ? "S" : "R",
    text: turn.text
  }));
}

function flattenTurns(turns) {
  return turns.map((turn) => `${turn.speaker}: ${turn.text}`).join(" ");
}

async function synthesizeMultispeaker(accessToken, projectId, turns, voiceName) {
  const response = await fetch("https://texttospeech.googleapis.com/v1beta1/text:synthesize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-goog-user-project": projectId
    },
    body: JSON.stringify({
      input: {
        multiSpeakerMarkup: {
          turns: mapTurnsForMultispeaker(turns)
        }
      },
      voice: {
        languageCode: "en-US",
        name: voiceName
      },
      audioConfig: {
        audioEncoding: "MP3"
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Multispeaker TTS failed with ${response.status}: ${await response.text()}`);
  }

  const payload = await response.json();
  if (!payload.audioContent) {
    throw new Error(`Multispeaker TTS returned no audio content: ${JSON.stringify(payload)}`);
  }

  return Buffer.from(payload.audioContent, "base64");
}

async function synthesizeSingleSpeaker(accessToken, projectId, turns, voiceName, gender) {
  const voice = voiceName
    ? { languageCode: "en-US", name: voiceName }
    : { languageCode: "en-US", ssmlGender: gender };

  const response = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-goog-user-project": projectId
    },
    body: JSON.stringify({
      input: {
        text: flattenTurns(turns)
      },
      voice,
      audioConfig: {
        audioEncoding: "MP3"
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Single-speaker TTS failed with ${response.status}: ${await response.text()}`);
  }

  const payload = await response.json();
  if (!payload.audioContent) {
    throw new Error(`Single-speaker TTS returned no audio content: ${JSON.stringify(payload)}`);
  }

  return Buffer.from(payload.audioContent, "base64");
}

async function writeAudioBriefing(fileName, audioBuffer, title, summaryNote, durationLabel, stories) {
  const outputPath = path.join(audioDir, fileName);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, audioBuffer);

  const currentFeed = await readJson(publishedStoriesPath, {
    stories,
    audioBriefings: defaultAudioBriefings
  });
  const relativeLink = `audio/${fileName}`;
  const briefing = {
    title,
    duration: durationLabel,
    note: summaryNote,
    link: relativeLink
  };

  const remainingBriefings = (currentFeed.audioBriefings || []).filter((item) => item.link !== relativeLink);

  await writeJson(publishedStoriesPath, {
    stories: currentFeed.stories || stories,
    audioBriefings: [briefing, ...remainingBriefings].slice(0, 6)
  });

  return outputPath;
}

async function main() {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const accessToken = process.env.GOOGLE_OAUTH_ACCESS_TOKEN;
  const location = process.env.GEMINI_LOCATION || "us-central1";
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const topStories = Number(process.env.AUDIO_BRIEFING_STORY_LIMIT || 6);
  const minutes = Number(process.env.AUDIO_BRIEFING_MINUTES || 5);
  const useMultispeaker = (process.env.GOOGLE_TTS_USE_MULTISPEAKER || "true").toLowerCase() !== "false";
  const multispeakerVoice = process.env.GOOGLE_TTS_MULTISPEAKER_VOICE || "en-US-Studio-MultiSpeaker";
  const fallbackVoiceName = process.env.GOOGLE_TTS_FALLBACK_VOICE_NAME || "";
  const fallbackGender = process.env.GOOGLE_TTS_FALLBACK_GENDER || "FEMALE";

  if (!projectId || !accessToken) {
    throw new Error("Missing Google credentials. Set GOOGLE_CLOUD_PROJECT_ID and GOOGLE_OAUTH_ACCESS_TOKEN.");
  }

  const approvedStories = (await fetchApprovedStories()).slice(0, topStories);
  if (!approvedStories.length) {
    throw new Error("No approved Airtable stories found for audio generation.");
  }

  const script = await generateScript(accessToken, projectId, location, model, approvedStories, minutes);
  let audioBuffer;
  let note = script.summaryNote;

  if (useMultispeaker) {
    try {
      audioBuffer = await synthesizeMultispeaker(accessToken, projectId, script.turns, multispeakerVoice);
      note = `${note} Generated with Google multi-speaker TTS.`;
    } catch (error) {
      console.warn(`Multispeaker synthesis unavailable, falling back to single speaker. ${error.message}`);
      audioBuffer = await synthesizeSingleSpeaker(accessToken, projectId, script.turns, fallbackVoiceName, fallbackGender);
      note = `${note} Generated with Google single-speaker TTS fallback.`;
    }
  } else {
    audioBuffer = await synthesizeSingleSpeaker(accessToken, projectId, script.turns, fallbackVoiceName, fallbackGender);
    note = `${note} Generated with Google single-speaker TTS.`;
  }

  const today = new Date().toISOString().slice(0, 10);
  const fileName = `briefing-${today}.mp3`;
  const outputPath = await writeAudioBriefing(
    fileName,
    audioBuffer,
    script.title,
    note,
    `${minutes} min`,
    approvedStories
  );

  console.log(`Generated audio briefing at ${outputPath} and updated ${publishedStoriesPath}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
