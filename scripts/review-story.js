const {
  parsePatch,
  readJson,
  reviewQueuePath,
  writeJson
} = require("./story-utils");

function mergeEditorial(target, patch) {
  return {
    ...target,
    ...patch,
    tags: Array.isArray(patch.tags) ? patch.tags : target.tags,
    related: Array.isArray(patch.related) ? patch.related : target.related,
    recentMovement: Array.isArray(patch.recentMovement) ? patch.recentMovement : target.recentMovement
  };
}

async function main() {
  const [command, id, patchArg] = process.argv.slice(2);
  const queue = await readJson(reviewQueuePath, []);

  if (!command || command === "list") {
    queue.forEach((item) => {
      console.log(`${item.id} | ${item.status} | ${item.subject}`);
    });
    return;
  }

  const item = queue.find((entry) => entry.id === id);
  if (!item) {
    throw new Error(`Story "${id}" not found in review queue.`);
  }

  if (command === "approve") {
    const patch = parsePatch(patchArg);
    item.status = "approved";
    item.editorial = mergeEditorial(item.editorial || {}, patch);
  } else if (command === "reject") {
    item.status = "rejected";
  } else if (command === "pending") {
    item.status = "pending";
  } else {
    throw new Error(`Unknown command "${command}". Use list, approve, pending, or reject.`);
  }

  await writeJson(reviewQueuePath, queue);
  console.log(`Updated ${item.id} to status ${item.status}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
