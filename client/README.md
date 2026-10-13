# Merkle Games

A responsive Nuxt 4 and TypeScript client for browsing games from the Merkle Games REST API.

## Requirements

- Node.js 20.19 or later
- The Games API running at `http://localhost:8000` (see `../server/README.md`)

## Run locally

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. To use another API URL, set `NUXT_PUBLIC_API_BASE`, for example:

```sh
NUXT_PUBLIC_API_BASE=http://localhost:8000/api/v1 npm run dev
```

PowerShell:

```powershell
$env:NUXT_PUBLIC_API_BASE = "http://localhost:8000/api/v1"
npm run dev
```

## Checks

```sh
npm run test
npm run typecheck
npm run build
```

## Implementation

The browse page requests IDs released from 2015-01-01 through 2017-12-31, selects 15 at random, and fetches each selected game's REST details and rating statistics. The API's HATEOAS `data` envelope is handled in the client. Sorting by average rating is the default; release date sorting, title search, and genre filtering operate on the selected set. Each card links to a detail page, which shows the description, image, developer, genres, rating, and reviews.

Images use the API-provided `image_url`; absent or broken images fall back to a local asset. API failures are surfaced with a retry action, and empty/filter states are explicit. No server code, GraphQL endpoints, Tailwind, or component libraries are used.
