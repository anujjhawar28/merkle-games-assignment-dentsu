# Merkle Games Client

A responsive Nuxt 4 client for discovering games from the Merkle Games REST API.

## Requirements and setup

- Node.js 20.19 or later
- npm 10 or later
- The API running locally (default: `http://localhost:8000`; see [server setup](../server/README.md))

From the client directory:

Copy `.env.example` to `.env` (`Copy-Item .env.example .env` in PowerShell, or `cp .env.example .env` on macOS/Linux), then run:

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. The client reads the API address from `NUXT_PUBLIC_API_BASE`:

```env
NUXT_PUBLIC_API_BASE=http://localhost:8000/api/v1
```

Set this variable in `.env` for local development or in the deployment environment. It must include the API version path.

## Architecture

`app.vue` mounts the default Nuxt layout around the current page. The layout provides a shared site shell, skip link, header, and footer. Pages contain route-specific data and markup; components encapsulate reusable interface elements and their scoped SCSS.

The API composable is the only layer that performs HTTP requests. It uses `fetchWithRetry` to retry transient network failures and HTTP 408, 429, and 5xx responses up to two times, with a short exponential delay. Other client errors fail immediately. Pages map common HTTP statuses to useful error messages and offer a manual retry action.

## Functionality

- The browse page requests game IDs in the configured 2015–2017 release window, samples up to 15 unique IDs, and fetches game details and rating statistics.
- Search filters the selected games by title; genre filtering and rating/date sorting operate on that same set.
- Detail pages show game information, artwork, ratings, and reviews.
- Missing or broken artwork uses the local fallback image.
- API requests use Nuxt lazy data loading. Game cards are lazy-loaded components and their images use native browser lazy loading. Page and component SCSS is scoped and can be split with the corresponding Nuxt chunks.
- Loading skeletons, empty states, retry actions, accessible focus styles, and reduced-motion behavior are provided.

## Index page flow

1. Fetch IDs for the configured release-date range.
2. Deduplicate and randomly sample up to 15 IDs without changing the API response.
3. Fetch each selected game's details and statistics through the retry-enabled API composable.
4. Combine the API statistics with review-based fallbacks, then display the results.
5. Apply title/genre filters and the selected sort order in computed state; no watchers are needed.

## Styling

- `app/assets/scss/variables.scss` defines shared color, typography, and layout tokens.
- `app/assets/scss/main.scss` imports those tokens and contains only global resets and accessibility helpers.
- Layout, page, and component styles live alongside their Vue files in `<style scoped lang="scss">` blocks.
- Sass is used for Vue component styles; Nuxt/Vite handles page-level CSS splitting during builds.

## Tests and build

```sh
npm test
npm run build
```

Vitest covers game selection, sorting, formatting, statistics, image URLs, the sort composable, retry boundaries, retry limits, and API status messages.

## Project structure

```text
app/
  assets/scss/       Shared variables and global styles
  components/        Shared labels, feedback, artwork, shell, cards, and skeleton
  composables/       API access and reusable reactive sorting
  layouts/           Shared page shell
  pages/             Browse and game detail routes
  utils/api/         Retry and HTTP error handling
  utils/game/        Game selection, sorting, formatting, stats, and images
  constants.ts       Shared application and API configuration
tests/               Vitest utility and API tests
```
