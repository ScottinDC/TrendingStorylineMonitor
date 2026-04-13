# Trending Storyline Monitor

A GitHub Pages-ready public-facing prototype for a Reddit-style story stream without voting. The page is designed to surface reviewed stories, topic momentum, source spread, related coverage, and audio briefings while keeping the first version simple.

## What is included

- Story feed with headline, source, date, slug, tags, summary, why-it-matters, and relevance
- Topic filter plus a topic-detail panel for deeper browsing
- Trends rail showing rising topics and recent movement
- Lightweight charts for topic volume, source spread, and trend direction
- Audio briefing links for weekly and topic-based summaries
- Seed content that mirrors the proposed Airtable/OpenAI/NotebookLM workflow

## Files

- `index.html` - page structure
- `styles.css` - layout and presentation
- `app.js` - seeded data and client-side rendering
- `.github/workflows/pages.yml` - GitHub Pages deployment workflow

## Publish on GitHub Pages

1. Create a new GitHub repository and add these files.
2. Push the repository to GitHub.
3. In GitHub, enable Pages for the repository.
4. The included workflow publishes the static site automatically on pushes to `main`.

## Suggested next integration step

For version one, keep Airtable as the source of truth and replace the seeded `stories` array in `app.js` with a generated JSON export or API response shaped like:

```json
{
  "headline": "string",
  "source": "string",
  "date": "YYYY-MM-DD",
  "slug": "string",
  "tags": ["string"],
  "topic": "string",
  "summary": "string",
  "whyItMatters": "string",
  "relevance": "string",
  "momentum": 0,
  "related": ["story-id"]
}
```

That keeps review and publishing logic in Airtable while the site stays a simple display layer.
