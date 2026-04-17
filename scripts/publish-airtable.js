const {
  defaultAudioBriefings,
  fetchAirtableRecords,
  normalizeAirtableStory,
  publishedStoriesPath,
  writeJson
} = require("./story-utils");

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
  const stories = approvedRecords.map(normalizeAirtableStory).sort(
    (a, b) => new Date(b.date) - new Date(a.date) || b.momentum - a.momentum
  );

  await writeJson(publishedStoriesPath, {
    stories,
    audioBriefings: defaultAudioBriefings
  });

  console.log(`Published ${stories.length} approved Airtable story record(s) into ${publishedStoriesPath}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
