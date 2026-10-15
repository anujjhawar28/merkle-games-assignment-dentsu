# Merkle Games

Merkle Games is a full-stack game archive with a REST and GraphQL API and a Nuxt 4 web client. Browse games released between 2015 and 2017, filter and sort the collection, and view game details, artwork, ratings, and player reviews.

## Project structure

- [`client/`](./client/) — Nuxt application and client tests.
- [`server/`](./server/) — Express API, GraphQL service, SQLite database, and server tests.

See the [client README](./client/README.md) and [server README](./server/README.md) for detailed setup, architecture, and API documentation.

## Requirements

- Docker and Docker Compose for the API, or Node.js 24+ and npm 10+ to run it directly.
- Node.js 20.19+ and npm 10+ for the client.

## Run locally

Start the API in Docker:

```powershell
Set-Location server
Copy-Item .env.example .env
docker compose up --build
```

In another terminal, configure and start the client:

```powershell
Set-Location client
Copy-Item .env.example .env
npm ci
npm run dev
```

The client is available at <http://localhost:3000>. Adjust API settings in `client/.env` if the backend is not at `http://localhost:8000` (see [client README](./client/README.md#environment-variables)). Restart the Nuxt dev server after changing `.env`.

## Services

| Service | URL |
| --- | --- |
| Web client | <http://localhost:3000> |
| REST API | <http://localhost:8000/api/v1> |
| Swagger API docs | <http://localhost:8000/api-docs> |
| GraphQL endpoint | <http://localhost:8000/graphql> |
| GraphQL Playground | <http://localhost:8000/graphql-sandbox> |
| Health check | <http://localhost:8000/health> |

## Tests

Run the client tests from `client/`:

```sh
npm test
```

Run the server tests from `server/`:

```sh
npm test
```

## Lighthouse

Homepage audit against a local production preview at <http://localhost:3000>:

![Lighthouse audit - homepage](./docs/lighthouse-home.png)

*Performance 91; Accessibility, Best Practices, and SEO 100. Chrome extensions can skew load metrics—audit in incognito or a profile without extensions if you need a clean performance run.*
