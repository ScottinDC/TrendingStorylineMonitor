const fallbackData = {
  stories: [
    {
      id: "water-rights-colorado",
      headline: "Colorado basin talks tighten as rural districts brace for new water restrictions",
      source: "highcountrynews.com",
      date: "2026-04-12",
      slug: "water-rights-colorado",
      url: "https://www.hcn.org/issues/58-4/colorado-basin-water-restrictions",
      relatedUrls: [
        "https://www.hcn.org/issues/58-4/colorado-basin-water-restrictions",
        "https://www.hcn.org/issues/58-4/rural-water-districts-summer-demand"
      ],
      tags: ["water policy", "rural counties", "climate"],
      topic: "Water access",
      summary: "Regional talks are converging on emergency conservation targets ahead of peak summer demand.",
      whyItMatters: "Food production, municipal planning, and interstate coordination are tightening at the same time.",
      relevance: "high relevance",
      momentum: 81,
      recentMovement: [4, 5, 5, 7, 8, 10, 12],
      related: ["crop-insurance-west", "reservoir-emergency-rule"]
    },
    {
      id: "crop-insurance-west",
      headline: "Farm groups press for crop insurance changes as drought losses spread westward",
      source: "apnews.com",
      date: "2026-04-11",
      slug: "crop-insurance-west",
      url: "https://apnews.com/article/western-drought-crop-insurance-farms",
      relatedUrls: [
        "https://apnews.com/article/western-drought-crop-insurance-farms"
      ],
      tags: ["agriculture", "drought", "insurance"],
      topic: "Water access",
      summary: "State advocates want faster claims handling and revised risk models as drought widens.",
      whyItMatters: "Insurance rules are becoming operating rules for farms under climate pressure.",
      relevance: "high relevance",
      momentum: 75,
      recentMovement: [3, 4, 5, 6, 7, 8, 9],
      related: ["water-rights-colorado", "reservoir-emergency-rule"]
    },
    {
      id: "grid-data-center-south",
      headline: "Power regulators weigh fast-track approvals for data center corridors across the South",
      source: "reuters.com",
      date: "2026-04-13",
      slug: "grid-data-center-south",
      url: "https://www.reuters.com/world/us/power-regulators-data-center-corridors-south-2026-04-13/",
      relatedUrls: [
        "https://www.reuters.com/world/us/power-regulators-data-center-corridors-south-2026-04-13/",
        "https://www.utilitydive.com/news/data-center-power-corridors-fast-track/744210/"
      ],
      tags: ["energy", "ai infrastructure", "utilities"],
      topic: "Grid strain",
      summary: "Utilities are debating how quickly new capacity can come online as large compute projects stack up.",
      whyItMatters: "Household reliability and industrial growth are now tied to the same buildout decisions.",
      relevance: "very high relevance",
      momentum: 92,
      recentMovement: [2, 3, 5, 7, 8, 11, 14],
      related: ["utility-rate-hearings", "semiconductor-water-demand"]
    },
    {
      id: "utility-rate-hearings",
      headline: "Consumer advocates push back on utility rate hikes tied to new server campus demand",
      source: "texastribune.org",
      date: "2026-04-10",
      slug: "utility-rate-hearings",
      url: "https://www.texastribune.org/2026/04/10/utility-rate-hearings-data-centers/",
      relatedUrls: [
        "https://www.texastribune.org/2026/04/10/utility-rate-hearings-data-centers/"
      ],
      tags: ["rates", "consumer impact", "electricity"],
      topic: "Grid strain",
      summary: "Public hearings are testing who pays when transmission upgrades follow industrial demand spikes.",
      whyItMatters: "Rate design will shape whether public support for AI-era grid expansion holds.",
      relevance: "medium relevance",
      momentum: 63,
      recentMovement: [2, 2, 3, 4, 5, 7, 8],
      related: ["grid-data-center-south", "semiconductor-water-demand"]
    },
    {
      id: "school-phone-bans",
      headline: "More states move from pilot programs to statewide school phone restrictions",
      source: "npr.org",
      date: "2026-04-12",
      slug: "school-phone-bans",
      url: "https://www.npr.org/2026/04/12/school-phone-ban-states",
      relatedUrls: [
        "https://www.npr.org/2026/04/12/school-phone-ban-states"
      ],
      tags: ["education", "youth policy", "mental health"],
      topic: "Student attention",
      summary: "Districts are moving from pilots to broader restrictions while working through enforcement details.",
      whyItMatters: "Policy momentum is outrunning implementation capacity in many systems.",
      relevance: "medium relevance",
      momentum: 58,
      recentMovement: [3, 3, 4, 4, 5, 6, 7],
      related: ["student-discipline-tech", "edtech-procurement"]
    },
    {
      id: "student-discipline-tech",
      headline: "District discipline data shows uneven rollout of classroom device rules",
      source: "chalkbeat.org",
      date: "2026-04-09",
      slug: "student-discipline-tech",
      url: "https://www.chalkbeat.org/2026/04/09/device-rules-discipline-data",
      relatedUrls: [
        "https://www.chalkbeat.org/2026/04/09/device-rules-discipline-data"
      ],
      tags: ["classroom policy", "district data", "implementation"],
      topic: "Student attention",
      summary: "Early district reporting shows rule enforcement varies sharply by school and staffing level.",
      whyItMatters: "The practical story is whether attention rules widen discipline disparities.",
      relevance: "moderate relevance",
      momentum: 44,
      recentMovement: [1, 2, 2, 3, 4, 4, 5],
      related: ["school-phone-bans", "edtech-procurement"]
    },
    {
      id: "semiconductor-water-demand",
      headline: "Chip expansion plans reignite debate over industrial water use in high-growth regions",
      source: "bloomberg.com",
      date: "2026-04-08",
      slug: "semiconductor-water-demand",
      url: "https://www.bloomberg.com/news/articles/2026-04-08/chip-water-demand-growth-regions",
      relatedUrls: [
        "https://www.bloomberg.com/news/articles/2026-04-08/chip-water-demand-growth-regions"
      ],
      tags: ["manufacturing", "industrial policy", "water demand"],
      topic: "Resource competition",
      summary: "Large manufacturing projects are colliding with local concerns over water, land, and subsidies.",
      whyItMatters: "Industrial policy and local resource stress are becoming the same public argument.",
      relevance: "high relevance",
      momentum: 69,
      recentMovement: [2, 4, 4, 5, 6, 8, 8],
      related: ["grid-data-center-south", "water-rights-colorado"]
    },
    {
      id: "reservoir-emergency-rule",
      headline: "Emergency reservoir rule changes trigger legal review across western states",
      source: "politico.com",
      date: "2026-04-07",
      slug: "reservoir-emergency-rule",
      url: "https://www.politico.com/news/2026/04/07/reservoir-emergency-rule-western-states-legal-review",
      relatedUrls: [
        "https://www.politico.com/news/2026/04/07/reservoir-emergency-rule-western-states-legal-review"
      ],
      tags: ["legal challenge", "reservoirs", "state response"],
      topic: "Water access",
      summary: "Temporary operating changes are shifting release timing and local planning assumptions.",
      whyItMatters: "Emergency rules can harden into precedent if another stress season follows.",
      relevance: "medium relevance",
      momentum: 61,
      recentMovement: [2, 2, 3, 4, 5, 6, 6],
      related: ["water-rights-colorado", "crop-insurance-west"]
    },
    {
      id: "edtech-procurement",
      headline: "District buyers revisit edtech contracts as classroom attention priorities shift",
      source: "edsurge.com",
      date: "2026-04-06",
      slug: "edtech-procurement",
      url: "https://www.edsurge.com/news/2026-04-06-edtech-procurement-attention-priorities",
      relatedUrls: [
        "https://www.edsurge.com/news/2026-04-06-edtech-procurement-attention-priorities"
      ],
      tags: ["procurement", "education budgets", "classroom tools"],
      topic: "Student attention",
      summary: "Buyers are reevaluating software categories that expanded during remote learning.",
      whyItMatters: "Budget changes are a durable downstream signal for where schools are headed.",
      relevance: "developing relevance",
      momentum: 38,
      recentMovement: [1, 1, 2, 2, 3, 4, 4],
      related: ["school-phone-bans", "student-discipline-tech"]
    }
  ],
  audioBriefings: [
    {
      title: "Civic Engagement: From Global Service to Local Activism",
      duration: "5 min",
      note: "This briefing explores contrasting forms of civic engagement, from structured international volunteerism to confrontational local activism.",
      link: "audio/briefing-2026-04-17.mp3"
    }
  ]
};

const DATA_URL = "./data/stories.json";

const topicFilter = document.querySelector("#topic-filter");
const topicFeed = document.querySelector("#topic-feed");
const topicDetail = document.querySelector("#topic-detail");
const activeFilters = document.querySelector("#active-filters");
const AUDIO_BRIEFING_SOURCE_THRESHOLD = 2;
const AUDIO_BRIEFING_STORY_THRESHOLD = 3;

let stories = [];
let audioBriefings = [];

const initialParams = new URLSearchParams(window.location.search);
let activeTopic = "all";
let activeTag = initialParams.get("tag") || "";

function toList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }

  return String(value || "")
    .split(/[,\n|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function firstSentence(value, fallback = "") {
  const trimmed = String(value || "").trim();
  if (!trimmed) {
    return fallback;
  }
  const match = trimmed.match(/.+?[.!?](?:\s|$)/);
  return (match ? match[0] : `${trimmed}.`).trim();
}

function trimSentenceEnd(value) {
  return String(value || "").trim().replace(/[.!?]+$/, "");
}

function dedupeBy(values, getKey) {
  const seen = new Set();
  return values.filter((item) => {
    const key = getKey(item);
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function normalizeMovementSeries(series) {
  const clean = toList(series).map((item) => Number(item)).filter((item) => Number.isFinite(item));
  if (!clean.length) {
    return [];
  }

  const min = Math.min(...clean);
  const max = Math.max(...clean);

  if (min === max) {
    return clean.map(() => 7);
  }

  return clean.map((value) => Math.max(1, Math.min(14, Math.round(1 + ((value - min) / (max - min)) * 13))));
}

function storyMovementSeries(story) {
  const semrushSeries = normalizeMovementSeries(story.semrushTrafficSeries);
  if (semrushSeries.length >= 3) {
    return semrushSeries;
  }

  return normalizeMovementSeries(story.recentMovement);
}

function formatDate(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatMovement(value) {
  return value > 0 ? `+${value}` : `${value}`;
}

function formatUrlLabel(value) {
  try {
    const parsed = new URL(value);
    const path = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/$/, "");
    return `${parsed.hostname}${path}`;
  } catch (_error) {
    return value;
  }
}

function normalizeStory(story) {
  const urlCandidates = [
    story.url,
    story.primaryUrl,
    story.storyUrl,
    story.outlookLink
  ].filter(Boolean);
  const relatedUrls = dedupeBy(
    [
      ...urlCandidates,
      ...toList(story.relatedUrls),
      ...toList(story.urls),
      ...toList(story.links)
    ].map((item) => String(item).trim()),
    (item) => item
  );

  return {
    ...story,
    topic: String(story.topic || story.rawTopic || "General").trim() || "General",
    tags: dedupeBy(toList(story.tags), (item) => item.toLowerCase()),
    recentMovement: toList(story.recentMovement).map((item) => Number(item) || 1).slice(0, 7),
    semrushTrafficSeries: toList(story.semrushTrafficSeries).map((item) => Number(item)).filter((item) => Number.isFinite(item)).slice(-7),
    summary: String(story.summary || "").trim() === "Needs editorial summary."
      ? ""
      : String(story.summary || "").trim(),
    whyItMatters: String(story.whyItMatters || "Needs editorial review before publishing.").trim(),
    relevance: String(story.relevance || "developing relevance").trim(),
    momentum: Number(story.momentum) || 50,
    url: urlCandidates[0] || relatedUrls[0] || "",
    relatedUrls
  };
}

function tagMatches(story) {
  return !activeTag || story.tags.some((tag) => tag.toLowerCase() === activeTag.toLowerCase());
}

function storiesForCurrentTag() {
  return stories.filter(tagMatches);
}

function groupedTopicEntries() {
  const grouped = new Map();

  storiesForCurrentTag().forEach((story) => {
    const groupKey = story.clusterId || story.topic;
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, { topic: story.topic, stories: [] });
    }
    grouped.get(groupKey).stories.push(story);
  });

  return [...grouped.values()]
    .map(({ topic, stories: topicStories }) => buildTopicEntry(topic, topicStories))
    .sort((a, b) => {
      if (b.direction.delta !== a.direction.delta) {
        return b.direction.delta - a.direction.delta;
      }
      if (b.avgMomentum !== a.avgMomentum) {
        return b.avgMomentum - a.avgMomentum;
      }
      if (b.volume !== a.volume) {
        return b.volume - a.volume;
      }
      return a.topic.localeCompare(b.topic);
    });
}

function averageMovementSeries(topicStories) {
  const storySeries = topicStories.map((story) => storyMovementSeries(story));
  const longest = Math.max(...storySeries.map((series) => series.length), 1);
  return Array.from({ length: longest }, (_, index) => {
    const values = storySeries
      .map((series) => series[index])
      .filter((value) => Number.isFinite(value));

    if (!values.length) {
      return 1;
    }

    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  });
}

function directionFromSeries(series) {
  const first = series[0] || 0;
  const last = series[series.length - 1] || 0;
  const delta = last - first;

  if (delta >= 2) {
    return { label: "Trending up", tone: "up", delta };
  }

  if (delta <= -2) {
    return { label: "Trending down", tone: "down", delta };
  }

  return { label: "Holding steady", tone: "steady", delta };
}

function collectTopicUrls(topicStories) {
  const urlRows = topicStories.flatMap((story) => {
    const urlSet = dedupeBy(
      [story.url, ...story.relatedUrls].filter(Boolean),
      (item) => item
    );

    return urlSet.map((url, index) => ({
      url,
      headline: story.headline,
      source: story.source,
      date: story.date,
      isPrimary: index === 0
    }));
  });

  return dedupeBy(urlRows, (item) => item.url);
}

function topicTags(topicStories) {
  return dedupeBy(
    topicStories.flatMap((story) => story.tags),
    (item) => item.toLowerCase()
  );
}

function buildTopicSummary(topic, topicStories, direction, urls, avgMomentum, outlets) {
  const strongestStory = [...topicStories].sort(
    (a, b) => b.momentum - a.momentum || new Date(b.date) - new Date(a.date)
  )[0];
  const directionPhrase = direction.tone === "up" ? "moving up" : direction.tone === "down" ? "slipping back" : "holding steady";
  const summarySource = strongestStory?.summary || strongestStory?.whyItMatters || "";
  const leadingSummary = trimSentenceEnd(firstSentence(summarySource, `${topic} is drawing attention across multiple sources.`));
  const significance = trimSentenceEnd(
    firstSentence(
      strongestStory?.whyItMatters,
      "It matters because the cluster is affecting public attention and editorial priorities."
    )
  );

  return `${leadingSummary}. ${significance} The cluster is ${directionPhrase} across ${urls.length || topicStories.length} tracked URLs, ${outlets} sources, and an average momentum of ${avgMomentum}.`;
}

function buildTopicEntry(topic, topicStories) {
  const sortedStories = [...topicStories].sort(
    (a, b) => b.momentum - a.momentum || new Date(b.date) - new Date(a.date)
  );
  const volume = topicStories.length;
  const avgMomentum = Math.round(
    topicStories.reduce((sum, story) => sum + story.momentum, 0) / Math.max(volume, 1)
  );
  const outlets = new Set(topicStories.map((story) => story.source)).size;
  const movementSeries = averageMovementSeries(topicStories);
  const direction = directionFromSeries(movementSeries);
  const urls = collectTopicUrls(topicStories);

  return {
    topic,
    volume,
    avgMomentum,
    outlets,
    movementSeries,
    direction,
    tags: topicTags(topicStories),
    stories: sortedStories,
    urls,
    summary: buildTopicSummary(topic, sortedStories, direction, urls, avgMomentum, outlets),
    briefing: audioBriefings.find(
      (briefing) =>
        briefing.link &&
        briefing.link !== "#" &&
        String(briefing.topic || "").trim().toLowerCase() === String(topic).trim().toLowerCase()
    ) || null
  };
}

function visibleTopicEntries() {
  const entries = groupedTopicEntries();
  if (activeTopic === "all") {
    return entries;
  }
  return entries.filter((entry) => entry.topic === activeTopic);
}

function getTopics() {
  return groupedTopicEntries().map((entry) => entry.topic);
}

function buildQuery(nextTopic, nextTag) {
  const url = new URL(window.location.href);

  url.searchParams.delete("topic");

  if (!nextTag) {
    url.searchParams.delete("tag");
  } else {
    url.searchParams.set("tag", nextTag);
  }

  return url;
}

function updateUrl() {
  window.history.replaceState({}, "", buildQuery(activeTopic, activeTag));
}

function renderTopicFilter() {
  const topics = getTopics();
  topicFilter.innerHTML = '<option value="all">All Topics</option>';

  topics.forEach((topic) => {
    const option = document.createElement("option");
    option.value = topic;
    option.textContent = topic.toLowerCase();
    topicFilter.append(option);
  });

  activeTopic = topics.includes(activeTopic) ? activeTopic : "all";
  topicFilter.value = activeTopic;
}

function renderActiveFilters() {
  activeFilters.innerHTML = "";

  if (!activeTag && activeTopic === "all") {
    return;
  }

  if (activeTopic !== "all") {
    const topicPill = document.createElement("button");
    topicPill.type = "button";
    topicPill.className = "filter-pill";
    topicPill.textContent = `topic: ${activeTopic}`;
    topicPill.addEventListener("click", () => selectTopic("all"));
    activeFilters.append(topicPill);
  }

  if (activeTag) {
    const tagPill = document.createElement("button");
    tagPill.type = "button";
    tagPill.className = "filter-pill";
    tagPill.textContent = `tag: ${activeTag}`;
    tagPill.addEventListener("click", () => selectTag(""));
    activeFilters.append(tagPill);
  }
}

function tagLink(tag) {
  const anchor = document.createElement("a");
  anchor.className = "tag";
  anchor.href = buildQuery("all", tag).toString();
  anchor.textContent = tag;
  return anchor;
}

function renderTopicFeed() {
  const entries = visibleTopicEntries();
  topicFeed.innerHTML = "";

  if (!entries.length) {
    topicFeed.innerHTML = '<div class="empty-state">No topics match the current filter yet.</div>';
    return;
  }

  entries.forEach((entry) => {
    const article = document.createElement("article");
    article.className = `topic-card direction-${entry.direction.tone}`;

    const header = document.createElement("button");
    header.type = "button";
    header.className = "topic-card-button";
    header.innerHTML = `
      <div class="topic-card-top">
        <strong>${entry.topic}</strong>
      </div>
      <div class="topic-card-meta">
        <span>Momentum ${entry.avgMomentum} / 100</span>
        <span class="direction-pill">${entry.direction.label}</span>
      </div>
    `;
    header.addEventListener("click", () => selectTopic(entry.topic));
    article.append(header);

    const summary = document.createElement("p");
    summary.className = "topic-summary-copy";
    summary.textContent = entry.summary;
    article.append(summary);

    const tagRow = document.createElement("div");
    tagRow.className = "tag-row";
    entry.tags.forEach((tag) => tagRow.append(tagLink(tag)));
    article.append(tagRow);

    if ((entry.outlets >= AUDIO_BRIEFING_SOURCE_THRESHOLD || entry.stories.length >= AUDIO_BRIEFING_STORY_THRESHOLD) && entry.briefing) {
      const controls = document.createElement("div");
      controls.className = "topic-audio-controls";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "audio-play-button";
      button.textContent = "Play Briefing";

      const audio = document.createElement("audio");
      audio.preload = "none";
      audio.src = entry.briefing.link;
      audio.className = "briefing-audio";

      button.addEventListener("click", async () => {
        if (audio.paused) {
          await audio.play();
          button.textContent = "Pause Briefing";
        } else {
          audio.pause();
          button.textContent = "Play Briefing";
        }
      });

      audio.addEventListener("pause", () => {
        button.textContent = "Play Briefing";
      });

      audio.addEventListener("play", () => {
        button.textContent = "Pause Briefing";
      });

      audio.addEventListener("error", () => {
        button.disabled = true;
        button.textContent = "Briefing Unavailable";
      });

      controls.append(button, audio);
      article.append(controls);
    }

    const details = document.createElement("details");
    details.className = "url-dropdown";
    details.open = activeTopic === entry.topic;

    const summaryRow = document.createElement("summary");
    summaryRow.textContent = `Sources (${entry.outlets})`;
    details.append(summaryRow);

    const urlList = document.createElement("ul");
    urlList.className = "url-list";

    if (!entry.urls.length) {
      const empty = document.createElement("li");
      empty.className = "empty-state";
      empty.textContent = "No source URLs are stored for this topic yet.";
      urlList.append(empty);
    } else {
      entry.urls.forEach((item) => {
        const row = document.createElement("li");
        row.className = "url-item";
        row.innerHTML = `
          <a href="${item.url}" target="_blank" rel="noreferrer">${formatUrlLabel(item.url)}</a>
          <span>${item.source}, ${formatDate(item.date)}</span>
        `;
        urlList.append(row);
      });
    }

    details.append(urlList);
    article.append(details);
    topicFeed.append(article);
  });
}

function renderTopicDetail() {
  const entries = groupedTopicEntries();

  if (activeTag) {
    const taggedStories = storiesForCurrentTag().sort(
      (a, b) => new Date(b.date) - new Date(a.date) || b.momentum - a.momentum
    );
    topicDetail.innerHTML = `
      <div class="topic-summary">
        <h3>Tag: ${activeTag}</h3>
        <p>${taggedStories.filter((story) => story.url || story.relatedUrls?.length).length} source links collected for this tag.</p>
      </div>
    `;

    const list = document.createElement("div");
    list.className = "topic-story-list";

    taggedStories.forEach((story) => {
      const item = document.createElement("a");
      item.href = story.url || "#";
      item.target = story.url ? "_blank" : "";
      item.rel = story.url ? "noreferrer" : "";
      item.textContent = `${story.topic}, ${story.headline}`;
      if (!story.url) {
        item.removeAttribute("target");
        item.removeAttribute("rel");
      }
      list.append(item);
    });

    topicDetail.append(list);
    return;
  }

  if (activeTopic === "all") {
    const lead = entries[0];

    if (!lead) {
      topicDetail.innerHTML = '<div class="empty-state">Choose a topic to browse deeper.</div>';
      return;
    }

    topicDetail.innerHTML = `
      <div class="topic-summary">
        <p>${entries.length} live topic clusters from ${storiesForCurrentTag().length} tracked sources.</p>
        <ul>
          <li>strongest topic: ${lead.topic}</li>
          <li>current direction leader: ${lead.direction.label.toLowerCase()}</li>
          <li>average momentum leader: ${lead.avgMomentum}</li>
        </ul>
      </div>
    `;

    const list = document.createElement("div");
    list.className = "topic-story-list";
    entries.forEach((entry) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `${entry.topic}, ${entry.direction.label.toLowerCase()}`;
      button.addEventListener("click", () => selectTopic(entry.topic));
      list.append(button);
    });
    topicDetail.append(list);
    return;
  }

  const entry = entries.find((item) => item.topic === activeTopic);

  if (!entry) {
    topicDetail.innerHTML = '<div class="empty-state">Choose a topic to browse deeper.</div>';
    return;
  }

  topicDetail.innerHTML = `
    <div class="topic-summary">
      <h3>${entry.topic}</h3>
      <p>${entry.summary}</p>
      <ul>
        <li>${entry.direction.label.toLowerCase()}</li>
        <li>average momentum ${entry.avgMomentum} / 100</li>
      </ul>
    </div>
  `;

  const list = document.createElement("div");
  list.className = "topic-story-list";

  entry.stories.forEach((story) => {
    const link = document.createElement("a");
    link.href = story.url || "#";
    link.target = story.url ? "_blank" : "";
    link.rel = story.url ? "noreferrer" : "";
    link.textContent = `${story.headline}, ${story.source}, ${formatDate(story.date)}`;
    if (!story.url) {
      link.removeAttribute("target");
      link.removeAttribute("rel");
    }
    list.append(link);
  });

  topicDetail.append(list);
}

function renderTopicVolumeChart() {
  const container = document.querySelector("#topic-volume-chart");
  const entries = groupedTopicEntries();
  const maxVolume = Math.max(...entries.map((item) => item.urls.length || item.volume), 1);
  container.innerHTML = "";

  entries.forEach((item) => {
    const value = item.urls.length || item.volume;
    const row = document.createElement("div");
    row.className = "chart-row";
    row.innerHTML = `
      <div class="chart-top">
        <span>${item.topic}</span>
        <strong>${value}</strong>
      </div>
      <div class="chart-track"><div class="chart-fill" style="width:${(value / maxVolume) * 100}%;"></div></div>
    `;
    container.append(row);
  });
}

function renderSourceSpreadChart() {
  const container = document.querySelector("#source-spread-chart");
  const entries = groupedTopicEntries();
  const maxOutlets = Math.max(...entries.map((item) => item.outlets), 1);
  container.innerHTML = "";

  entries.forEach((item) => {
    const row = document.createElement("div");
    row.className = "chart-row";
    row.innerHTML = `
      <div class="chart-top">
        <span>${item.topic}</span>
        <strong>${item.outlets}</strong>
      </div>
      <div class="chart-track"><div class="chart-fill" style="width:${(item.outlets / maxOutlets) * 100}%;"></div></div>
    `;
    container.append(row);
  });
}

function renderTrendDirectionChart() {
  const container = document.querySelector("#trend-direction-chart");
  const entries = groupedTopicEntries();
  container.innerHTML = "";

  entries.forEach((item) => {
    const maxPoint = Math.max(...item.movementSeries, 1);
    const card = document.createElement("div");
    card.className = "spark-card";
    card.innerHTML = `<strong>${item.topic}</strong><div class="sparkline"></div>`;

    const line = card.querySelector(".sparkline");
    item.movementSeries.forEach((value) => {
      const bar = document.createElement("span");
      bar.style.height = `${Math.max(18, (value / maxPoint) * 100)}%`;
      line.append(bar);
    });

    container.append(card);
  });
}

function renderAll() {
  renderTopicFilter();
  renderActiveFilters();
  renderTopicFeed();
  renderTopicDetail();
  renderTopicVolumeChart();
  renderSourceSpreadChart();
  renderTrendDirectionChart();
}

function selectTopic(topic) {
  const topics = getTopics();
  activeTopic = topics.includes(topic) ? topic : "all";
  topicFilter.value = activeTopic;
  updateUrl();
  renderTopicFeed();
  renderTopicDetail();
  renderActiveFilters();
}

function selectTag(tag) {
  activeTag = tag;
  if (activeTopic !== "all" && !groupedTopicEntries().some((entry) => entry.topic === activeTopic)) {
    activeTopic = "all";
  }
  updateUrl();
  renderAll();
}

async function loadFeedData() {
  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Feed request failed with ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn("Falling back to embedded seed data.", error);
    return fallbackData;
  }
}

topicFilter?.addEventListener("change", (event) => {
  selectTopic(event.target.value);
});

loadFeedData().then((data) => {
  stories = (Array.isArray(data.stories) ? data.stories : fallbackData.stories).map(normalizeStory);
  audioBriefings = Array.isArray(data.audioBriefings) ? data.audioBriefings : fallbackData.audioBriefings;
  renderAll();
});
