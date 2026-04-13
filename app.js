const stories = [
  {
    id: "water-rights-colorado",
    headline: "Colorado basin talks tighten as rural districts brace for new water restrictions",
    source: "highcountrynews.com",
    date: "2026-04-12",
    slug: "water-rights-colorado",
    tags: ["water policy", "rural counties", "climate"],
    topic: "Water access",
    summary: "regional talks converge on emergency conservation targets ahead of peak summer demand",
    whyItMatters: "food production, municipal planning, and interstate coordination all tighten at once",
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
    tags: ["agriculture", "drought", "insurance"],
    topic: "Water access",
    summary: "state advocates want faster claims handling and revised risk models as drought widens",
    whyItMatters: "insurance rules are becoming operating rules for farms under climate pressure",
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
    tags: ["energy", "ai infrastructure", "utilities"],
    topic: "Grid strain",
    summary: "utilities debate how quickly new capacity can come online as large compute projects stack up",
    whyItMatters: "household reliability and industrial growth are now tied to the same buildout decisions",
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
    tags: ["rates", "consumer impact", "electricity"],
    topic: "Grid strain",
    summary: "public hearings are testing who pays when transmission upgrades follow industrial demand spikes",
    whyItMatters: "rate design will shape whether public support for AI-era grid expansion holds",
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
    tags: ["education", "youth policy", "mental health"],
    topic: "Student attention",
    summary: "districts move from pilots to broader restrictions while working through enforcement details",
    whyItMatters: "policy momentum is outrunning implementation capacity in many systems",
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
    tags: ["classroom policy", "district data", "implementation"],
    topic: "Student attention",
    summary: "early district reporting shows rule enforcement varies sharply by school and staffing level",
    whyItMatters: "the practical story is whether attention rules widen discipline disparities",
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
    tags: ["manufacturing", "industrial policy", "water demand"],
    topic: "Resource competition",
    summary: "large manufacturing projects are colliding with local concerns over water, land, and subsidies",
    whyItMatters: "industrial policy and local resource stress are becoming the same public argument",
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
    tags: ["legal challenge", "reservoirs", "state response"],
    topic: "Water access",
    summary: "temporary operating changes are shifting release timing and local planning assumptions",
    whyItMatters: "emergency rules can harden into precedent if another stress season follows",
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
    tags: ["procurement", "education budgets", "classroom tools"],
    topic: "Student attention",
    summary: "buyers are reevaluating software categories that expanded during remote learning",
    whyItMatters: "budget changes are a durable downstream signal for where schools are headed",
    relevance: "developing relevance",
    momentum: 38,
    recentMovement: [1, 1, 2, 2, 3, 4, 4],
    related: ["school-phone-bans", "student-discipline-tech"]
  }
];

const audioBriefings = [
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

const topicFilter = document.querySelector("#topic-filter");
const storyFeed = document.querySelector("#story-feed");
const trendsList = document.querySelector("#trends-list");
const topicDetail = document.querySelector("#topic-detail");
const audioList = document.querySelector("#audio-list");
const storyTemplate = document.querySelector("#story-item-template");

const topics = [...new Set(stories.map((story) => story.topic))].sort();
let activeTopic = new URLSearchParams(window.location.search).get("topic") || "all";

function formatDate(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function topicStats() {
  return topics
    .map((topic) => {
    const topicStories = stories.filter((story) => story.topic === topic);
    const volume = topicStories.length;
    const avgMomentum = Math.round(
      topicStories.reduce((sum, story) => sum + story.momentum, 0) / volume
    );
    const outlets = new Set(topicStories.map((story) => story.source)).size;
    const movement = avgMomentum - 50;

    return {
      topic,
      volume,
      avgMomentum,
      outlets,
      movement,
      stories: topicStories
    };
    })
    .sort((a, b) => b.avgMomentum - a.avgMomentum || b.volume - a.volume || a.topic.localeCompare(b.topic));
}

function storyById(id) {
  return stories.find((story) => story.id === id);
}

function sortedStoriesForTopic(topic) {
  return [...stories.filter((story) => story.topic === topic)].sort(
    (a, b) => b.momentum - a.momentum || new Date(b.date) - new Date(a.date)
  );
}

function renderTopicFilter() {
  topics.forEach((topic) => {
    const option = document.createElement("option");
    option.value = topic;
    option.textContent = topic.toLowerCase();
    topicFilter.append(option);
  });
  activeTopic = topics.includes(activeTopic) ? activeTopic : "all";
  topicFilter.value = activeTopic;
}

function filteredStories() {
  const selected = topicFilter.value;
  return [...stories]
    .filter((story) => selected === "all" || story.topic === selected)
    .sort((a, b) => new Date(b.date) - new Date(a.date) || b.momentum - a.momentum);
}

function selectTopic(topic) {
  activeTopic = topics.includes(topic) ? topic : "all";
  topicFilter.value = activeTopic;
  const url = new URL(window.location.href);
  if (activeTopic === "all") {
    url.searchParams.delete("topic");
  } else {
    url.searchParams.set("topic", activeTopic);
  }
  window.history.replaceState({}, "", url);
  renderStories();
  renderTopicDetail();
}

function formatMovement(value) {
  return value > 0 ? `+${value}` : `${value}`;
}

function renderStories() {
  const items = filteredStories();
  storyFeed.innerHTML = "";

  if (!items.length) {
    storyFeed.innerHTML = '<li class="empty-state">No approved stories match this topic yet.</li>';
    return;
  }

  items.forEach((story) => {
    const node = storyTemplate.content.firstElementChild.cloneNode(true);

    const headline = node.querySelector(".story-headline");
    headline.textContent = story.headline;
    headline.addEventListener("click", () => selectTopic(story.topic));

    node.querySelector(".story-source").textContent = story.source;
    node.querySelector(".story-date").textContent = formatDate(story.date);
    node.querySelector(".story-slug").textContent = story.slug;
    node.querySelector(".story-summary").textContent = story.summary;
    node.querySelector(".relevance-pill").textContent = `${story.relevance} | momentum ${story.momentum}`;
    node.querySelector(".story-why").textContent = story.whyItMatters;

    const tagRow = node.querySelector(".tag-row");
    story.tags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.className = "tag";
      chip.textContent = tag;
      tagRow.append(chip);
    });

    const relatedLinks = node.querySelector(".related-links");
    story.related
      .map(storyById)
      .filter(Boolean)
      .forEach((relatedStory) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = relatedStory.slug;
        button.addEventListener("click", () => {
          selectTopic(relatedStory.topic);
          window.requestAnimationFrame(() => {
            document.getElementById(relatedStory.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
          });
        });
        relatedLinks.append(button);
      });

    node.id = story.id;
    storyFeed.append(node);
  });
}

function renderTrends() {
  const trendData = topicStats();
  trendsList.innerHTML = "";

  trendData.forEach((entry) => {
    const item = document.createElement("div");
    item.className = "trend-item";
    item.innerHTML = `
      <div class="trend-item-top">
        <strong>${entry.topic}</strong>
        <span>${formatMovement(entry.movement)}</span>
      </div>
      <p>${entry.volume} stories | ${entry.outlets} sources</p>
    `;
    const jump = document.createElement("button");
    jump.type = "button";
    jump.textContent = "open thread";
    jump.addEventListener("click", () => selectTopic(entry.topic));
    item.append(jump);
    trendsList.append(item);
  });
}

function renderTopicDetail() {
  const stats = topicStats();
  const selectedTopic = topicFilter.value;

  if (selectedTopic === "all") {
    const leadTopic = stats[0];

    if (!leadTopic) {
      topicDetail.innerHTML = '<div class="empty-state">Choose a topic to browse deeper.</div>';
      return;
    }

    topicDetail.innerHTML = `
      <div class="topic-summary">
        <h3>All topics</h3>
        <p>${stories.length} approved stories across ${stats.length} live topics</p>
        <ul>
          <li>strongest thread: ${leadTopic.topic}</li>
          <li>average momentum leader: ${leadTopic.avgMomentum}</li>
          <li>most active source spread: ${Math.max(...stats.map((entry) => entry.outlets))} outlets</li>
        </ul>
      </div>
    `;

    const list = document.createElement("div");
    list.className = "topic-story-list";
    stats.forEach((entry) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `${entry.topic} | ${entry.volume} stories | momentum ${entry.avgMomentum}`;
      button.addEventListener("click", () => selectTopic(entry.topic));
      list.append(button);
    });

    topicDetail.append(list);
    return;
  }

  const topicEntry = stats.find((entry) => entry.topic === selectedTopic);

  if (!topicEntry) {
    topicDetail.innerHTML = '<div class="empty-state">Choose a topic to browse deeper.</div>';
    return;
  }

  topicDetail.innerHTML = "";

  const strongestStory = sortedStoriesForTopic(topicEntry.topic)[0];
  const summary = document.createElement("div");
  summary.className = "topic-summary";
  summary.innerHTML = `
    <h3>${topicEntry.topic}</h3>
    <p>${topicEntry.volume} approved stories | average momentum ${topicEntry.avgMomentum} | ${topicEntry.outlets} active sources</p>
    <ul>
      <li>recent movement: +${topicEntry.movement}</li>
      <li>strongest signal: ${strongestStory.headline}</li>
      <li>common thread: ${strongestStory.tags[0]}</li>
    </ul>
  `;
  topicDetail.append(summary);

  const list = document.createElement("div");
  list.className = "topic-story-list";
  sortedStoriesForTopic(topicEntry.topic).forEach((story) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${story.headline} | ${story.source} | momentum ${story.momentum}`;
    button.addEventListener("click", () => {
      selectTopic(topicEntry.topic);
      document.getElementById(story.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    list.append(button);
  });

  topicDetail.append(list);
}

function renderAudioBriefings() {
  audioList.innerHTML = "";
  audioBriefings.forEach((briefing) => {
    const entry = document.createElement("div");
    entry.className = "audio-entry";
    entry.innerHTML = `
      <div class="audio-entry-top">
        <strong>${briefing.title}</strong>
        <span>${briefing.duration}</span>
      </div>
      <p>${briefing.note}</p>
      <a href="${briefing.link}">open briefing</a>
    `;
    audioList.append(entry);
  });
}

function renderTopicVolumeChart() {
  const container = document.querySelector("#topic-volume-chart");
  const stats = topicStats();
  const maxVolume = Math.max(...stats.map((item) => item.volume), 1);
  container.innerHTML = "";

  stats.forEach((item) => {
    const row = document.createElement("div");
    row.className = "chart-row";
    row.innerHTML = `
      <div class="chart-top">
        <span>${item.topic}</span>
        <strong>${item.volume}</strong>
      </div>
      <div class="chart-track"><div class="chart-fill" style="width:${(item.volume / maxVolume) * 100}%;"></div></div>
    `;
    container.append(row);
  });
}

function renderSourceSpreadChart() {
  const container = document.querySelector("#source-spread-chart");
  const stats = topicStats();
  const maxOutlets = Math.max(...stats.map((item) => item.outlets), 1);
  container.innerHTML = "";

  stats.forEach((item) => {
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
  const stats = topicStats();
  container.innerHTML = "";

  stats.forEach((item) => {
    const strongestStory = sortedStoriesForTopic(item.topic)[0];
    const values = strongestStory.recentMovement;
    const maxPoint = Math.max(...values);
    const card = document.createElement("div");
    card.className = "spark-card";
    card.innerHTML = `<strong>${item.topic}</strong><div class="sparkline"></div>`;

    const line = card.querySelector(".sparkline");
    values.forEach((value) => {
      const bar = document.createElement("span");
      bar.style.height = `${Math.max(18, (value / maxPoint) * 100)}%`;
      line.append(bar);
    });

    container.append(card);
  });
}

topicFilter?.addEventListener("change", (event) => {
  selectTopic(event.target.value);
});

renderTopicFilter();
renderStories();
renderTrends();
renderTopicDetail();
renderAudioBriefings();
renderTopicVolumeChart();
renderSourceSpreadChart();
renderTrendDirectionChart();
