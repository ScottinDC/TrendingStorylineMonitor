const {
  loadDotEnv,
  normalizeReviewItem,
  readJson,
  reviewQueuePath,
  writeJson
} = require("./story-utils");

async function fetchAccessToken() {
  const tenantId = process.env.MS_TENANT_ID;
  const clientId = process.env.MS_CLIENT_ID;
  const clientSecret = process.env.MS_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Missing Microsoft Graph credentials. Set MS_TENANT_ID, MS_CLIENT_ID, and MS_CLIENT_SECRET.");
  }

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope: "https://graph.microsoft.com/.default"
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (!response.ok) {
    throw new Error(`Token request failed with ${response.status}: ${await response.text()}`);
  }

  const payload = await response.json();
  return payload.access_token;
}

async function graphGet(token, path) {
  const response = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Graph request failed for ${path} with ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

async function resolveFolder(token, mailbox, folderName) {
  if (!folderName || folderName === "inbox") {
    return "inbox";
  }

  if (folderName.startsWith("id:")) {
    return folderName.slice(3);
  }

  const rootFolders = await graphGet(
    token,
    `/users/${encodeURIComponent(mailbox)}/mailFolders?$top=200&includeHiddenFolders=true&$select=id,displayName`
  );

  const match = (rootFolders.value || []).find(
    (folder) => folder.displayName.toLowerCase() === folderName.toLowerCase()
  );

  if (!match) {
    throw new Error(`Could not find Outlook folder "${folderName}". Use a well-known name like "inbox" or prefix a folder id with "id:".`);
  }

  return match.id;
}

async function fetchMessages(token, mailbox, folderId, limit) {
  const select = [
    "id",
    "internetMessageId",
    "subject",
    "bodyPreview",
    "receivedDateTime",
    "webLink",
    "from"
  ].join(",");
  const orderBy = "$orderby=receivedDateTime desc";
  const top = `$top=${limit}`;
  return graphGet(
    token,
    `/users/${encodeURIComponent(mailbox)}/mailFolders/${encodeURIComponent(folderId)}/messages?$select=${select}&${orderBy}&${top}`
  );
}

async function main() {
  await loadDotEnv();

  const mailbox = process.env.OUTLOOK_USER_EMAIL;
  const folderName = process.env.OUTLOOK_MAIL_FOLDER || "inbox";
  const limit = Number(process.env.OUTLOOK_MAX_MESSAGES || 25);

  if (!mailbox) {
    throw new Error("Missing OUTLOOK_USER_EMAIL.");
  }

  const token = await fetchAccessToken();
  const folderId = await resolveFolder(token, mailbox, folderName);
  const messages = await fetchMessages(token, mailbox, folderId, limit);
  const existingQueue = await readJson(reviewQueuePath, []);

  const knownMessageIds = new Set(
    existingQueue.flatMap((item) => [item.sourceMessageId, item.internetMessageId]).filter(Boolean)
  );

  const additions = [];
  for (const message of messages.value || []) {
    if (knownMessageIds.has(message.id) || knownMessageIds.has(message.internetMessageId)) {
      continue;
    }
    additions.push(normalizeReviewItem(message));
  }

  const updatedQueue = [...additions, ...existingQueue].sort(
    (a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)
  );

  await writeJson(reviewQueuePath, updatedQueue);

  console.log(`Synced ${additions.length} new Outlook story candidate(s) from "${folderName}" into ${reviewQueuePath}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
