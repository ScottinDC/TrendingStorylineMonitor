# Podcast API Setup

This project can generate a NotebookLM-style audio briefing using Google's Podcast API without requiring NotebookLM Enterprise notebook licenses.

## What you need

- Google Cloud project with the Discovery Engine API enabled
- Podcast API access on that project
- IAM role `roles/discoveryengine.podcastApiUser`
- A service account JSON key stored in GitHub as `GOOGLE_SERVICE_ACCOUNT_KEY`
- GitHub secret `GOOGLE_CLOUD_PROJECT_ID`

Google's official docs:

- [Podcast API](https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/podcast-api)

Important notes from Google:

- Podcast API access is available only to select Google Cloud customers.
- The API is standalone and doesn't require a NotebookLM notebook.
- `SHORT` podcast length is typically 4 to 5 minutes.
- The output is an MP3 file.

## GitHub secrets

Add these repository secrets:

- `GOOGLE_SERVICE_ACCOUNT_KEY` - full JSON service account key
- `GOOGLE_CLOUD_PROJECT_ID` - your Google Cloud project id
- `PODCAST_API_LANGUAGE_CODE` - optional, for example `en-US`
- `PODCAST_API_LENGTH` - optional, `SHORT` or the longer mode you choose
- `PODCAST_BRIEFING_STORY_LIMIT` - optional, default is `6`

Existing Airtable secrets are also used:

- `AIRTABLE_BASE_ID`
- `AIRTABLE_TABLE_NAME`
- `AIRTABLE_TOKEN`
- `AIRTABLE_VIEW_NAME`

## Workflow

The workflow file is:

- `.github/workflows/generate-podcast-briefing.yml`

The generator script is:

- `scripts/generate-podcast-briefing.js`

What it does:

1. fetches approved Airtable stories
2. converts the top stories into Podcast API text contexts
3. requests a short podcast briefing
4. polls the long-running operation
5. downloads the MP3 into `audio/`
6. updates `data/stories.json` with a new `audioBriefings` entry
7. commits the MP3 and JSON back to GitHub

## Manual run

After the secrets are configured, open the GitHub workflow and click **Run workflow**:

- `Generate podcast briefing`

If the API access and IAM are correct, the latest generated MP3 will be committed into `audio/` and linked from `data/stories.json`.
