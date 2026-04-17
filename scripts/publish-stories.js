const {
  defaultAudioBriefings,
  normalizePublishedStory,
  publishedStoriesPath,
  readJson,
  reviewQueuePath,
  writeJson
} = require("./story-utils");

async function main() {
  const queue = await readJson(reviewQueuePath, []);
  const current = await readJson(publishedStoriesPath, {
    stories: [],
    audioBriefings: defaultAudioBriefings
  });

  const publishedMap = new Map((current.stories || []).map((story) => [story.id, story]));
  const approvedItems = queue.filter((item) => item.status === "approved");

  approvedItems.forEach((item) => {
    const story = normalizePublishedStory(item);
    publishedMap.set(story.id, story);
  });

  const publishedStories = [...publishedMap.values()].sort(
    (a, b) => new Date(b.date) - new Date(a.date) || b.momentum - a.momentum
  );

  await writeJson(publishedStoriesPath, {
    stories: publishedStories,
    audioBriefings: current.audioBriefings?.length ? current.audioBriefings : defaultAudioBriefings
  });

  console.log(`Published ${approvedItems.length} approved review item(s) into ${publishedStoriesPath}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
