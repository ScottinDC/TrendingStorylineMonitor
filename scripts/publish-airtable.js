const {
  defaultAudioBriefings,
  fetchAirtableRecords,
  normalizeAirtableStory,
  publishedStoriesPath,
  readJson,
  writeJson
} = require("./story-utils");
const { clusterStories } = require("./topic-clustering");

async function fetchApprovedRecords() {
  return fetchAirtableRecords({
    params: {
      filterByFormula: "{Status}='Approved'",
      "sort[0][field]": "Date",
      "sort[0][direction]": "desc"
    }
  });
}

async function main() {
  const approvedRecords = await fetchApprovedRecords();
  const current = await readJson(publishedStoriesPath, {
    stories: [],
    audioBriefings: defaultAudioBriefings
  });
  const stories = clusterStories(approvedRecords.map(normalizeAirtableStory)).sort(
    (a, b) => new Date(b.date) - new Date(a.date) || b.momentum - a.momentum
  );

  await writeJson(publishedStoriesPath, {
    stories,
    audioBriefings: current.audioBriefings?.length ? current.audioBriefings : defaultAudioBriefings
  });

  console.log(`Published ${stories.length} approved Airtable story record(s) into ${publishedStoriesPath}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
