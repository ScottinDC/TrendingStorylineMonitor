# Trending Storyline Monitor

A GitHub Pages-ready public story stream for reviewed story threads, topic momentum, source spread, and audio briefings. The static site now reads from `data/stories.json`, and the repo includes a small Outlook-to-review-queue pipeline so the feed can become operational instead of staying hand-seeded.

## What is included

- Public-facing story feed with filters, topic detail, trends, charts, and audio briefings
- `data/stories.json` as the published source consumed by the site
- Outlook ingestion script that pulls messages from Microsoft Graph into `data/review-queue.json`
- Review script for approving or rejecting queued items
- Publish script that turns approved review items into live site stories
- GitHub Pages workflow for static deployment

## Files

- `index.html` - page structure
- `styles.css` - layout and presentation
- `app.js` - client-side rendering from `data/stories.json`
- `data/stories.json` - published story feed used by the site
- `data/review-queue.json` - editorial review queue populated from Outlook
- `scripts/sync-stories.js` - pulls candidate stories from Outlook via Microsoft Graph
- `scripts/review-story.js` - marks queued items as approved, pending, or rejected
- `scripts/publish-stories.js` - publishes approved stories to the live feed
- `scripts/publish-airtable.js` - rebuilds the live feed from approved Airtable records
- `docs/airtable-schema.md` - Airtable field layout for the review table
- `prompts/story-extraction.md` - OpenAI prompt for Zapier extraction
- `.github/workflows/pages.yml` - GitHub Pages deployment workflow
- `.github/workflows/publish-from-airtable.yml` - on-demand Airtable publish workflow

## Setup

1. Copy `.env.example` to `.env` or export the variables in your shell.
2. Register a Microsoft Entra application with application permission to read mail for the target mailbox.
3. Grant admin consent for the Graph mail permission.
4. Point `OUTLOOK_USER_EMAIL` at the mailbox that receives story emails.
5. Add Airtable secrets in GitHub Actions for publish automation.
6. Commit and push after publishing data updates so GitHub Pages picks them up.

The Outlook sync script uses Microsoft Graph application auth and expects:

- `MS_TENANT_ID`
- `MS_CLIENT_ID`
- `MS_CLIENT_SECRET`
- `OUTLOOK_USER_EMAIL`
- `OUTLOOK_MAIL_FOLDER` such as `inbox` or a folder id prefixed with `id:`
- `OUTLOOK_MAX_MESSAGES`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_TABLE_NAME`
- `AIRTABLE_TOKEN`
- `AIRTABLE_VIEW_NAME`

## Workflow

1. Pull messages from Outlook into the review queue:

```bash
npm run sync:outlook
```

2. See the queued items:

```bash
npm run review:list
```

3. Approve one with an editorial patch:

```bash
node scripts/review-story.js approve story-id '{"topic":"Water access","tags":["drought","policy"],"whyItMatters":"Why this should be in the public feed.","momentum":72}'
```

4. Publish approved stories into the live site feed:

```bash
npm run publish:stories
```

5. Push the updated JSON to GitHub so Pages republishes.

## Airtable Publish Path

To rebuild the site directly from Airtable:

```bash
npm run publish:airtable
```

For GitHub automation, add these repository secrets:

- `AIRTABLE_BASE_ID`
- `AIRTABLE_TABLE_NAME`
- `AIRTABLE_TOKEN`
- `AIRTABLE_VIEW_NAME` (optional)

Then trigger `.github/workflows/publish-from-airtable.yml` manually, or from Zapier using GitHub `repository_dispatch` with event type `publish-stories`.

## Recommended Zapier Chain

1. Outlook new email in `Story Intake`
2. OpenAI extraction using [`prompts/story-extraction.md`](./prompts/story-extraction.md)
3. Airtable create record using [`docs/airtable-schema.md`](./docs/airtable-schema.md)
4. Airtable status changed to `Approved`
5. Zapier webhook to GitHub `repository_dispatch`

## Published Story Shape

The site consumes `data/stories.json` in this form:

```json
{
  "stories": [
    {
      "id": "string",
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
      "recentMovement": [1, 2, 3],
      "related": ["story-id"]
    }
  ],
  "audioBriefings": []
}
```

## Notes

- The frontend falls back to embedded sample data if `data/stories.json` is missing or unreadable.
- The review queue is intentionally JSON-first for speed. If you want multi-editor workflow next, Airtable is the obvious next source of truth.
