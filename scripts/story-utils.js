const fs = require("node:fs/promises");
const path = require("node:path");

const dataDir = path.join(__dirname, "..", "data");
const envPath = path.join(__dirname, "..", ".env");
const reviewQueuePath = path.join(dataDir, "review-queue.json");
const publishedStoriesPath = path.join(dataDir, "stories.json");

const defaultAudioBriefings = [
  {
    title: "Weekly briefing: Grid strain and infrastructure politics",
    duration: "12 min",
    note: "source-grounded weekly roundup for public listening and team review",
    link: "#"
  },
  {
    title: "Topic explainer: Water access pressure points",
    duration: "9 min",
    note: "clustered source synthesis spanning policy, agriculture, and legal response",
    link: "#"
  },
  {
    title: "Weekly briefing: Student attention and device rules",
    duration: "8 min",
    note: "quick narrative pass across policy rollout, district data, and procurement",
    link: "#"
  }
];

async function readJson(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      return fallback;
    }
    throw error;
  }
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function loadDotEnv() {
  try {
    const raw = await fs.readFile(envPath, "utf8");
    raw.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        return;
      }
      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) {
        return;
      }
      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();
      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    });
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function titleCase(value) {
  return String(value || "")
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function firstSentence(value, fallback) {
  const trimmed = String(value || "").trim();
  if (!trimmed) {
    return fallback;
  }
  const match = trimmed.match(/.+?[.!?](?:\s|$)/);
  return (match ? match[0] : trimmed).trim();
}

function extractDomain(address) {
  if (!address) {
    return "outlook";
  }
  const normalized = address.toLowerCase();
  const domain = normalized.includes("@") ? normalized.split("@").pop() : normalized;
  return domain.replace(/^www\./, "");
}

function buildRecentMovement(momentum) {
  const safeMomentum = Math.max(10, Math.min(100, Number(momentum) || 50));
  const base = Math.max(1, Math.round(safeMomentum / 12));
  return Array.from({ length: 7 }, (_, index) => Math.min(14, base + index));
}

function normalizeReviewItem(message) {
  const sender = message.from?.emailAddress?.address || "";
  const subject = (message.subject || "").trim() || "Untitled story";
  const preview = (message.bodyPreview || "").replace(/\s+/g, " ").trim();
  const webLink = message.webLink || "";
  const slug = slugify(subject) || `story-${Date.now()}`;
  const topicGuess = titleCase(subject.split(/[:-]/)[0] || "General");

  return {
    id: slug,
    status: "pending",
    sourceMessageId: message.id,
    internetMessageId: message.internetMessageId || "",
    receivedAt: message.receivedDateTime || new Date().toISOString(),
    sender,
    senderDomain: extractDomain(sender),
    subject,
    bodyPreview: preview,
    webLink,
    editorial: {
      headline: subject,
      source: extractDomain(sender),
      date: (message.receivedDateTime || new Date().toISOString()).slice(0, 10),
      slug,
      tags: [],
      topic: topicGuess,
      summary: firstSentence(preview, "Needs editorial summary."),
      whyItMatters: "Needs editorial review before publishing.",
      relevance: "developing relevance",
      momentum: 50,
      recentMovement: buildRecentMovement(50),
      related: []
    }
  };
}

function normalizePublishedStory(item) {
  const editorial = item.editorial || {};
  const headline = editorial.headline || item.subject || "Untitled story";
  const slug = slugify(editorial.slug || headline || item.id) || item.id;
  const date = String(editorial.date || item.receivedAt || new Date().toISOString()).slice(0, 10);
  const momentum = Math.max(1, Math.min(100, Number(editorial.momentum) || 50));
  const recentMovement = Array.isArray(editorial.recentMovement) && editorial.recentMovement.length
    ? editorial.recentMovement.map((value) => Number(value) || 1)
    : buildRecentMovement(momentum);

  return {
    id: item.id || slug,
    headline,
    source: editorial.source || item.senderDomain || "outlook",
    date,
    slug,
    url: editorial.url || item.webLink || "",
    relatedUrls: Array.isArray(editorial.relatedUrls) ? editorial.relatedUrls : [],
    tags: Array.isArray(editorial.tags) ? editorial.tags : [],
    topic: editorial.topic || "General",
    summary: editorial.summary || firstSentence(item.bodyPreview, "Needs editorial summary."),
    whyItMatters: editorial.whyItMatters || "Needs editorial review before publishing.",
    relevance: editorial.relevance || "developing relevance",
    momentum,
    recentMovement,
    related: Array.isArray(editorial.related) ? editorial.related : []
  };
}

function splitList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || "")
    .split(/[,\n|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function extractUrls(value) {
  const matches = String(value || "").match(/https?:\/\/[^\s<>"')\]]+/gi) || [];
  const seen = new Set();

  return matches
    .map((item) => item.replace(/[),.;]+$/, ""))
    .filter((item) => {
      if (!item || seen.has(item)) {
        return false;
      }
      seen.add(item);
      return true;
    });
}

function normalizeAirtableStory(record) {
  const fields = record.fields || {};
  const headline = String(fields.Headline || "").trim() || "Untitled story";
  const slug = slugify(fields.Slug || headline || record.id) || record.id;
  const date = String(fields.Date || new Date().toISOString()).slice(0, 10);
  const momentum = Math.max(1, Math.min(100, Number(fields.Momentum) || 50));
  const recentMovement = splitList(fields.RecentMovement).map((value) => Number(value) || 1);
  const related = splitList(fields.Related);
  const tags = splitList(fields.Tags);
  const rawEmailUrls = extractUrls(fields["Raw Email"]);
  const relatedUrls = splitList(
    fields["Related URLs"] ||
      fields.URLs ||
      fields.Links
  );
  const combinedUrls = [...new Set([...relatedUrls, ...rawEmailUrls])];
  const url = String(
    fields.URL ||
      fields["Primary URL"] ||
      fields["Story URL"] ||
      fields["Source URL"] ||
      fields["Outlook Link"] ||
      combinedUrls[0] ||
      ""
  ).trim();

  return {
    id: slug,
    headline,
    source: String(fields.Source || "airtable").trim() || "airtable",
    date,
    slug,
    url,
    relatedUrls: combinedUrls,
    tags,
    topic: String(fields.Topic || "General").trim() || "General",
    summary: String(fields.Summary || "Needs editorial summary.").trim(),
    whyItMatters: String(fields["Why It Matters"] || "Needs editorial review before publishing.").trim(),
    relevance: String(fields.Relevance || "developing relevance").trim(),
    momentum,
    recentMovement: recentMovement.length ? recentMovement : buildRecentMovement(momentum),
    related
  };
}

async function fetchAirtableRecords(options = {}) {
  await loadDotEnv();

  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || "Stories";
  const token = process.env.AIRTABLE_TOKEN;
  const viewName = process.env.AIRTABLE_VIEW_NAME || "";
  const params = new URLSearchParams({
    pageSize: "100",
    ...options.params
  });

  if (!baseId || !token) {
    throw new Error("Missing Airtable credentials. Set AIRTABLE_BASE_ID and AIRTABLE_TOKEN.");
  }

  if (viewName && !params.has("view")) {
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

function parsePatch(input) {
  if (!input) {
    return {};
  }
  return JSON.parse(input);
}

module.exports = {
  defaultAudioBriefings,
  fetchAirtableRecords,
  loadDotEnv,
  normalizeAirtableStory,
  normalizePublishedStory,
  normalizeReviewItem,
  parsePatch,
  publishedStoriesPath,
  readJson,
  reviewQueuePath,
  writeJson
};
