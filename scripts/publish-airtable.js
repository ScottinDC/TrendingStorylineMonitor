const {
  defaultAudioBriefings,
  loadDotEnv,
  normalizeAirtableStory,
  publishedStoriesPath,
  writeJson
} = require("./story-utils");

async function fetchApprovedRecords() {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || "Stories";
  const token = process.env.AIRTABLE_TOKEN;
  const viewName = process.env.AIRTABLE_VIEW_NAME || "";

  if (!baseId || !token) {
    throw new Error("Missing Airtable credentials. Set AIRTABLE_BASE_ID and AIRTABLE_TOKEN.");
  }

  const params = new URLSearchParams({
    pageSize: "100",
    filterByFormula: "{Status}='Approved'",
    "sort[0][field]": "Date",
    "sort[0][direction]": "desc"
  });

  if (viewName) {
    params.set("view", viewName);
  }

  const records = [];
  let offset = "";

  do {
    if (offset) {
      params.set("offset", offset);
    } else {
      params.delete("offset");
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Airtable request failed with ${response.status}: ${await response.text()}`);
    }

    const payload = await response.json();
    records.push(...(payload.records || []));
    offset = payload.offset || "";
  } while (offset);

  return records;
}

async function main() {
  await loadDotEnv();

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
