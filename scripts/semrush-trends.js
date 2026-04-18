function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function buildMonthStart(dateString) {
  const value = String(dateString || "").slice(0, 10);
  if (!value) {
    return "";
  }
  return `${value.slice(0, 7)}-01`;
}

function addDays(dateString, offset) {
  const date = new Date(`${dateString}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

function monthStartsForStories(stories) {
  const months = new Set();

  stories.forEach((story) => {
    const month = buildMonthStart(story.date);
    if (month) {
      months.add(month);
    }

    const previousDay = addDays(story.date, -6);
    const previousMonth = buildMonthStart(previousDay);
    if (previousMonth) {
      months.add(previousMonth);
    }
  });

  return [...months].sort();
}

function extractSemrushTarget(urlValue) {
  try {
    const parsed = new URL(String(urlValue || "").trim());
    return parsed.hostname.replace(/^www\./, "");
  } catch (_error) {
    return "";
  }
}

function detectDelimiter(headerLine) {
  if (headerLine.includes(";")) {
    return ";";
  }
  if (headerLine.includes("\t")) {
    return "\t";
  }
  return ",";
}

function splitDelimitedLine(line, delimiter) {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === delimiter) {
      cells.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function parseDelimitedTable(raw) {
  const lines = String(raw || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  if (!lines.length) {
    return [];
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = splitDelimitedLine(lines[0], delimiter).map((header) => header.toLowerCase());

  return lines.slice(1).map((line) => {
    const values = splitDelimitedLine(line, delimiter);
    return headers.reduce((row, header, index) => {
      row[header] = values[index] ?? "";
      return row;
    }, {});
  });
}

function extractDateCell(row) {
  return (
    row.date ||
    row.dt ||
    row.day ||
    row.display_date ||
    ""
  ).slice(0, 10);
}

function extractVisitsCell(row) {
  const value = row.visits || row.traffic || row.sessions || row.value || row.users || "";
  const normalized = Number(String(value).replace(/,/g, "").trim());
  return Number.isFinite(normalized) ? normalized : null;
}

async function fetchSemrushDailyTraffic({ apiKey, target, displayDate, database = "us", targetType = "root_domain" }) {
  if (!apiKey || !target || !displayDate) {
    return [];
  }

  const params = new URLSearchParams({
    key: apiKey,
    target,
    target_type: targetType,
    display_date: displayDate,
    database
  });

  const response = await fetch(`https://api.semrush.com/analytics/ta/api/v3/summary_by_day?${params.toString()}`, {
    headers: {
      Accept: "text/csv, text/plain, application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Semrush Daily Traffic failed with ${response.status}: ${await response.text()}`);
  }

  const raw = await response.text();
  const rows = parseDelimitedTable(raw);

  return rows
    .map((row) => ({
      date: extractDateCell(row),
      visits: extractVisitsCell(row)
    }))
    .filter((row) => row.date && Number.isFinite(row.visits));
}

async function loadTrafficMapForTargets(targets, monthStarts, options) {
  const trafficMap = new Map();

  for (const target of targets) {
    const targetMap = new Map();

    for (const monthStart of monthStarts) {
      try {
        const rows = await fetchSemrushDailyTraffic({
          ...options,
          target,
          displayDate: monthStart
        });

        rows.forEach((row) => {
          targetMap.set(row.date, row.visits);
        });
      } catch (error) {
        console.warn(`Semrush traffic fetch skipped for ${target} ${monthStart}: ${error.message}`);
      }
    }

    if (targetMap.size) {
      trafficMap.set(target, targetMap);
    }
  }

  return trafficMap;
}

function buildWindowSeries(targetMap, dateString, days = 7) {
  const values = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const key = addDays(dateString, -offset);
    const value = targetMap.get(key);
    if (Number.isFinite(value)) {
      values.push(value);
    } else if (values.length) {
      values.push(values[values.length - 1]);
    }
  }

  return values;
}

function toMovementSeries(trafficSeries) {
  if (!Array.isArray(trafficSeries) || trafficSeries.length < 3) {
    return [];
  }

  const min = Math.min(...trafficSeries);
  const max = Math.max(...trafficSeries);

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return [];
  }

  if (min === max) {
    return trafficSeries.map(() => 7);
  }

  return trafficSeries.map((value) => {
    const normalized = 1 + ((value - min) / (max - min)) * 13;
    return clamp(Math.round(normalized), 1, 14);
  });
}

function blendMomentum(baseMomentum, trafficSeries) {
  if (!trafficSeries.length) {
    return baseMomentum;
  }

  const first = trafficSeries[0];
  const last = trafficSeries[trafficSeries.length - 1];
  const growthRate = first > 0 ? (last - first) / first : 0;
  const semrushSignal = clamp(Math.round(50 + growthRate * 35), 15, 95);

  return clamp(Math.round(baseMomentum * 0.7 + semrushSignal * 0.3), 1, 100);
}

async function enrichStoriesWithSemrush(stories, options = {}) {
  const apiKey = options.apiKey || process.env.SEMRUSH_API_KEY;
  if (!apiKey) {
    return stories;
  }

  const database = options.database || process.env.SEMRUSH_DATABASE || "us";
  const targets = [...new Set(stories.map((story) => extractSemrushTarget(story.url)).filter(Boolean))];
  if (!targets.length) {
    return stories;
  }

  const monthStarts = monthStartsForStories(stories);
  const trafficMap = await loadTrafficMapForTargets(targets, monthStarts, {
    apiKey,
    database
  });

  return stories.map((story) => {
    const target = extractSemrushTarget(story.url);
    const targetTraffic = trafficMap.get(target);
    if (!targetTraffic) {
      return story;
    }

    const trafficSeries = buildWindowSeries(targetTraffic, story.date, 7);
    if (trafficSeries.length < 3) {
      return story;
    }

    return {
      ...story,
      semrushTarget: target,
      semrushTrafficSeries: trafficSeries,
      semrushTrafficValue: trafficSeries[trafficSeries.length - 1],
      semrushTrafficDelta: trafficSeries[trafficSeries.length - 1] - trafficSeries[0],
      recentMovement: toMovementSeries(trafficSeries),
      momentum: blendMomentum(story.momentum, trafficSeries)
    };
  });
}

module.exports = {
  enrichStoriesWithSemrush,
  extractSemrushTarget
};
