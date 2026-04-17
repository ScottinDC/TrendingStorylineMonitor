# Audio Briefing Setup

This project can generate a NotebookLM-style explainer by combining Gemini script generation with Google Cloud Text-to-Speech.

## What you need

- Google Cloud project with **Vertex AI API** enabled
- Google Cloud project with **Cloud Text-to-Speech API** enabled
- A service account JSON key stored in GitHub as `GOOGLE_SERVICE_ACCOUNT_KEY`
- GitHub secret `GOOGLE_CLOUD_PROJECT_ID`
- Service account role `roles/aiplatform.user`
- Text-to-Speech access on the project

Google's official references:

- [Build a podcast with Gemini 1.5 Pro and TTS](https://cloud.google.com/blog/products/ai-machine-learning/learn-how-to-build-a-podcast-with-gemini-1-5-pro)
- [Generate content with Gemini in Vertex AI](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference)
- [Generate dialogue with multiple speakers](https://cloud.google.com/text-to-speech/docs/create-dialogue-with-multispeakers)
- [Create voice audio files](https://docs.cloud.google.com/text-to-speech/docs/create-audio)

Important note:

- Google's multi-speaker TTS voice is allowlisted. If it isn't enabled on your project, this workflow automatically falls back to single-speaker synthesis.

## GitHub secrets

Add these repository secrets:

- `GOOGLE_SERVICE_ACCOUNT_KEY` - full JSON service account key
- `GOOGLE_CLOUD_PROJECT_ID` - your Google Cloud project id
- `GEMINI_LOCATION` - optional, default `us-central1`
- `GEMINI_MODEL` - optional, default `gemini-2.5-flash`
- `GOOGLE_TTS_USE_MULTISPEAKER` - optional, default `true`
- `GOOGLE_TTS_MULTISPEAKER_VOICE` - optional, default `en-US-Studio-MultiSpeaker`
- `GOOGLE_TTS_FALLBACK_VOICE_NAME` - optional, fallback single-speaker voice name
- `GOOGLE_TTS_FALLBACK_GENDER` - optional, default `FEMALE`
- `AUDIO_BRIEFING_STORY_LIMIT` - optional, default `6`
- `AUDIO_BRIEFING_MINUTES` - optional, default `5`

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
2. asks Gemini to write a two-speaker explainer script
3. tries to synthesize with Google multi-speaker TTS
4. falls back to single-speaker TTS if multi-speaker access isn't enabled
5. writes the MP3 into `audio/`
6. updates `data/stories.json` with a new `audioBriefings` entry
7. commits the MP3 and JSON back to GitHub

## Manual run

After the secrets are configured, open the GitHub workflow and click **Run workflow**:

- `Generate audio briefing`

If the APIs and IAM are correct, the latest generated MP3 will be committed into `audio/` and linked from `data/stories.json`.
