const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "been", "being", "but", "by", "for", "from", "has",
  "have", "if", "in", "into", "is", "it", "its", "of", "on", "or", "that", "the", "their", "this",
  "to", "was", "were", "will", "with", "about", "after", "ahead", "amid", "among", "around", "across",
  "before", "behind", "below", "between", "during", "inside", "near", "over", "through", "under",
  "new", "more", "most", "less", "least", "not", "than", "too", "very", "can", "could", "should",
  "would", "still", "just", "also", "up", "down", "out", "off", "only", "one", "two", "three",
  "draws", "line", "plan", "plans", "second", "copy", "underway", "across", "targets"
]);

const LOCATION_PATTERNS = [
  { label: "Wisconsin", terms: ["wisconsin", "dane county", "madison", "wkow", "wpr"] },
  { label: "Across the West", terms: ["across the west", "western", "west", "nevada", "utah", "wyoming", "colorado"] },
  { label: "Federal", terms: ["federal", "u.s.", "us ", "bureau of land management", "blm"] }
];

const GENERIC_LABEL_PATTERNS = [
  /\bdepartment tackles\b/i,
  /\bdraws line\b/i,
  /\bplan second\b/i,
  /\bunderway across\b/i,
  /\btargets\b/i,
  /\bchallenge\b/i,
  /\bcopy\b/i
];

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function titleCase(value) {
  return String(value || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatLabel(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  return raw
    .split(/\s+/)
    .map((part) => {
      if (/^[A-Z0-9/&-]{2,}$/.test(part)) {
        return part;
      }
      if (/^[a-z0-9/&-]{2,}$/.test(part) && /[A-Z]{2,}/.test(raw)) {
        return part;
      }
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(" ")
    .replace(/\s+\/\s+/g, " / ");
}

function compactText(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9\s/-]+/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(value) {
  return compactText(value)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

function buildPhrases(value) {
  const tokens = tokenize(value);
  const phrases = [];

  for (let index = 0; index < tokens.length - 1; index += 1) {
    const bigram = `${tokens[index]} ${tokens[index + 1]}`;
    if (!STOPWORDS.has(tokens[index]) && !STOPWORDS.has(tokens[index + 1])) {
      phrases.push(bigram);
    }

    if (index < tokens.length - 2) {
      const trigram = `${tokens[index]} ${tokens[index + 1]} ${tokens[index + 2]}`;
      if ([tokens[index], tokens[index + 1], tokens[index + 2]].every((token) => !STOPWORDS.has(token))) {
        phrases.push(trigram);
      }
    }
  }

  return phrases;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function splitTopicCandidates(value) {
  return String(value || "")
    .split(/[;,]|(?:\s+\|\s+)/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function textForStory(story) {
  return [
    story.headline,
    story.topic,
    story.rawTopic,
    ...(Array.isArray(story.tags) ? story.tags : []),
    story.summary,
    story.whyItMatters,
    ...(Array.isArray(story.related) ? story.related : []),
    story.url,
    ...(Array.isArray(story.relatedUrls) ? story.relatedUrls : [])
  ]
    .map((value) => String(value || ""))
    .join(" ");
}

function storySignature(story) {
  const text = textForStory(story);
  const tokens = unique(tokenize(text));
  const phrases = unique([
    ...buildPhrases(story.headline),
    ...buildPhrases(story.topic),
    ...buildPhrases(Array.isArray(story.tags) ? story.tags.join(" ") : ""),
    ...buildPhrases(story.summary)
  ]);

  return {
    text: compactText(text),
    tokens,
    phrases
  };
}

function overlapScore(left, right) {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  const intersection = left.filter((item) => rightSet.has(item)).length;
  const union = new Set([...leftSet, ...rightSet]).size || 1;
  return intersection / union;
}

function similarity(leftSignature, rightSignature) {
  const tokenScore = overlapScore(leftSignature.tokens, rightSignature.tokens);
  const phraseScore = overlapScore(leftSignature.phrases, rightSignature.phrases);

  let locationScore = 0;
  LOCATION_PATTERNS.forEach((pattern) => {
    const leftHas = pattern.terms.some((term) => leftSignature.text.includes(term));
    const rightHas = pattern.terms.some((term) => rightSignature.text.includes(term));
    if (leftHas && rightHas) {
      locationScore = Math.max(locationScore, 1);
    }
  });

  return tokenScore * 0.55 + phraseScore * 0.3 + locationScore * 0.15;
}

function detectIssueLabel(signature) {
  const text = signature.text;

  if (
    text.includes("animal testing") &&
    (text.includes("beagle") || text.includes("protest") || text.includes("protesting"))
  ) {
    return "Beagle Animal Testing Protests";
  }

  if (
    text.includes("veganism") &&
    text.includes("progressive values")
  ) {
    return "Veganism and Progressive Values";
  }

  if (
    text.includes("sled dogs") &&
    (text.includes("alaska") || text.includes("mat-su") || text.includes("matanuska"))
  ) {
    return "Sled Dog Neglect in Alaska";
  }

  if (
    text.includes("animal cruelty") &&
    (text.includes("arraigned") || text.includes(" owner ") || text.includes("on animal cruelty charges"))
  ) {
    return "Animal Cruelty Charges";
  }

  if (
    text.includes("animal rescue") &&
    (text.includes("henderson") || text.includes("illegal organization"))
  ) {
    return "Animal Rescue Conditions in Henderson";
  }

  if (
    (text.includes("kitten season") || text.includes("spay/neuter") || text.includes("spayed") || text.includes("neutered")) &&
    (text.includes("albuquerque") || text.includes("cabq"))
  ) {
    return "Cats Spayed and Neutered in Albuquerque";
  }

  if (
    text.includes("usda") &&
    (text.includes("slaughterhouse") || text.includes("inspection protocol") || text.includes("meat processing"))
  ) {
    return "USDA Slaughterhouse Inspection Rules";
  }

  if (
    (text.includes("animal rights") || text.includes("activist") || text.includes("protest") || text.includes("beagle")) &&
    (text.includes("ridglan") || text.includes("breeding") || text.includes("farms"))
  ) {
    return "Animal Rights Activism";
  }

  if (
    (text.includes("wild horse") || text.includes("wild horses") || text.includes("burro") || text.includes("burros")) &&
    (text.includes("roundup") || text.includes("roundups") || text.includes("gather") || text.includes("blm"))
  ) {
    return "Wild Horse and Burro Roundups";
  }

  if (
    text.includes("peace corps") ||
    text.includes("volunteerism") ||
    text.includes("public service") ||
    text.includes("cultural exchange")
  ) {
    return "Public Service / Volunteerism";
  }

  return "";
}

function detectLocationLabel(signature) {
  return LOCATION_PATTERNS.find((pattern) => pattern.terms.some((term) => signature.text.includes(term)))?.label || "";
}

function buildClusterLabel(cluster) {
  const aggregateSignature = storySignature({
    headline: cluster.stories.map((story) => story.headline).join(" "),
    topic: cluster.stories.map((story) => story.topic || story.rawTopic || "").join(" "),
    tags: cluster.stories.flatMap((story) => story.tags || []),
    summary: cluster.stories.map((story) => story.summary).join(" "),
    whyItMatters: cluster.stories.map((story) => story.whyItMatters).join(" "),
    related: cluster.stories.flatMap((story) => story.related || []),
    url: cluster.stories.map((story) => story.url).join(" "),
    relatedUrls: cluster.stories.flatMap((story) => story.relatedUrls || [])
  });

  const issue = detectIssueLabel(aggregateSignature) || chooseFallbackIssue(cluster, aggregateSignature);
  const location = detectLocationLabel(aggregateSignature);

  if (!location || issue.includes(location) || issue === "Public Service / Volunteerism") {
    return issue;
  }

  if (location === "Federal") {
    return `Federal ${issue}`;
  }

  if (location === "Across the West") {
    return `${issue} Across the West`;
  }

  return `${issue} in ${location}`;
}

function isMeaningfulCandidate(label) {
  const normalized = String(label || "").trim();
  if (!normalized) {
    return false;
  }

  if (GENERIC_LABEL_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return false;
  }

  const tokens = tokenize(normalized);
  return tokens.length >= 2;
}

function scoreCandidate(label, aggregateSignature) {
  const normalized = compactText(label);
  if (!normalized) {
    return -1;
  }

  let score = 0;
  const tokenCount = tokenize(label).length;
  score += Math.min(tokenCount, 4);

  if (aggregateSignature.text.includes(normalized)) {
    score += 3;
  }

  if (normalized.includes("animal welfare") || normalized.includes("animal rights")) {
    score += 2;
  }

  if (normalized.includes("spay") || normalized.includes("neuter") || normalized.includes("kitten")) {
    score += 2;
  }

  if (normalized.includes("volunteer") || normalized.includes("public service")) {
    score += 2;
  }

  return score;
}

function chooseFallbackIssue(cluster, aggregateSignature) {
  const candidates = [];

  cluster.stories.forEach((story) => {
    splitTopicCandidates(story.rawTopic || story.topic || "").forEach((candidate) => {
      candidates.push(candidate);
    });

    (Array.isArray(story.tags) ? story.tags : []).forEach((tag) => {
      candidates.push(tag);
    });
  });

  const meaningful = unique(candidates)
    .map((candidate) => formatLabel(candidate))
    .filter(isMeaningfulCandidate);

  const best = meaningful
    .map((candidate) => ({ candidate, score: scoreCandidate(candidate, aggregateSignature) }))
    .sort((a, b) => b.score - a.score || b.candidate.length - a.candidate.length)[0]?.candidate;

  if (best) {
    return best;
  }

  return "General Coverage";
}

function clusterStories(stories) {
  const prepared = stories.map((story) => ({
    ...story,
    rawTopic: story.rawTopic || story.topic || "General",
    _signature: storySignature(story)
  }));

  const clusters = [];

  prepared.forEach((story) => {
    let bestCluster = null;
    let bestScore = 0;

    clusters.forEach((cluster) => {
      const scores = cluster.stories.map((candidate) => similarity(candidate._signature, story._signature));
      const clusterScore = Math.max(...scores, 0);
      if (clusterScore > bestScore) {
        bestScore = clusterScore;
        bestCluster = cluster;
      }
    });

    if (bestCluster && bestScore >= 0.24) {
      bestCluster.stories.push(story);
    } else {
      clusters.push({ stories: [story] });
    }
  });

  return clusters.flatMap((cluster) => {
    const label = buildClusterLabel(cluster);
    const clusterId = slugify(label) || "general";

    return cluster.stories.map((story) => ({
      ...story,
      topic: label,
      clusterId,
      _signature: undefined
    }));
  });
}

module.exports = {
  clusterStories
};
