# Airtable Schema

Create one table named `Stories`.

## Required fields

- `Status` - single select: `New`, `Needs Edit`, `Approved`, `Rejected`, `Published`
- `Headline` - long text
- `Source` - single line text
- `Date` - date
- `Topic` - single line text
- `Summary` - long text
- `Why It Matters` - long text
- `Tags` - long text or multi-select
- `Relevance` - single select
- `Momentum` - number
- `RecentMovement` - long text storing comma-separated values such as `3,4,5,5,6,7,8`
- `Related` - long text storing comma-separated slugs
- `Slug` - single line text
- `URL` - url
- `Related URLs` - long text storing newline- or comma-separated URLs
- `Outlook Link` - url
- `Raw Email` - long text

## Zapier mapping

- Outlook subject -> `Headline`
- Outlook sender domain -> `Source`
- Outlook received date -> `Date`
- OpenAI `topic` -> `Topic`
- OpenAI `summary` -> `Summary`
- OpenAI `why_it_matters` -> `Why It Matters`
- OpenAI `tags` -> `Tags`
- OpenAI `relevance` -> `Relevance`
- OpenAI `momentum` -> `Momentum`
- OpenAI `recent_movement` -> `RecentMovement`
- OpenAI `related` -> `Related`
- extracted primary article URL -> `URL`
- additional extracted links -> `Related URLs`
- Outlook web link -> `Outlook Link`
- Outlook preview or body -> `Raw Email`
- Default `Status` -> `New`

## Publishing rule

Only records with `Status = Approved` are published into `data/stories.json`.

If `URL` and `Related URLs` are populated, the published site clusters topics around those links and exposes them in the topic dropdown.
