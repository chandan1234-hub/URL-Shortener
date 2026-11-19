# URL Shortener

A TypeScript URL shortener split into a React frontend and an Express backend, with PostgreSQL as the database.

The interface is a small site: a home page, a form for entering a long URL, and a not-found page. The API currently exposes a health check. The database contract defines users and short links so the shortening flow can be built on top of it.

## Architecture

```text
Browser
  │
  ▼
Frontend (React SPA, Vite)          http://localhost:5173
  pages: /  /shorten  *
  │
  ▼
Backend (Express)                   http://localhost:3000
  GET /health
  Prisma client in src/prisma/db.ts
  │
  ▼
PostgreSQL 16                       localhost:5432
  User, ShortUrl
```

The frontend and backend are separate Node apps. They do not share a package. Docker Compose starts PostgreSQL, the backend, and the frontend together. The backend waits until Postgres reports healthy, then the frontend starts after the backend.

Request flow today:

1. Vite serves the React app and React Router picks the page from the URL.
2. The shortener form collects a URL and stops the browser from navigating away. It does not call the API yet.
3. Express answers `GET /health` with `{ "status": "ok" }`.
4. `backend/src/prisma/db.ts` opens a Prisma Postgres client from `DATABASE_URL`. Routes do not use that client yet.

Data model in `backend/src/prisma/contract.prisma`:

- **User** — email, full name, password, and the short links they own.
- **ShortUrl** — unique short code, original URL, optional expiry, and the owning user.

## Tech stack

### Frontend

| Role | Library |
| --- | --- |
| UI | React 19, React DOM |
| Routing | React Router 7 |
| Language | TypeScript |
| Dev server and build | Vite 8, `@vitejs/plugin-react` |
| Lint | Oxlint |

Styling is plain CSS next to each page and the shared layout. There is no UI component library and no data-fetching library.

### Backend

| Role | Library |
| --- | --- |
| HTTP API | Express 5 |
| Language | TypeScript |
| Database access | Prisma 8 (`@prisma/orm-postgres`) |
| Environment variables | dotenv |
| Dev runner | tsx (`tsx watch`) |
| Schema tooling | Prisma CLI, `@prisma/cli-engine` |

### Infrastructure

| Role | Choice |
| --- | --- |
| Database | PostgreSQL 16 (`postgres:16`) |
| App runtime in Compose | Node.js 22 |
| Orchestration | Docker Compose |

## Project layout

```text
frontend/
  src/
    main.tsx                 app entry
    App.tsx                  RouterProvider
    routes.tsx               route table
    route-links.ts           path constants and nav links
    components/site-layout   header, footer, page outlet
    pages/home               landing page
    pages/shortener          URL form
    pages/not-found          unknown routes
backend/
  src/index.ts               Express app and /health
  src/prisma/
    contract.prisma          User and ShortUrl models
    db.ts                    Prisma client
  prisma.config.ts           Prisma CLI config
docker-compose.yml           Postgres, backend, frontend
```

Frontend routes:

| Path | Page |
| --- | --- |
| `/` | Home |
| `/shorten` | Shorten a URL |
| anything else | Not found |

## Run locally

You need Node.js 22 and PostgreSQL 15 or newer.

**Database.** From the repo root:

```bash
docker compose up db
```

**Backend.** In `backend/`:

```bash
cp .env.example .env
npm install
npm run contract:emit
npm run db:init
npm run dev
```

`DATABASE_URL` in `.env.example` matches the Compose Postgres user, password, and database (`user` / `password` / `mydb` on port 5432). The API listens on port 3000. Check it with `GET http://localhost:3000/health`.

**Frontend.** In `frontend/`:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

Other scripts:

| App | Command | What it does |
| --- | --- | --- |
| Frontend | `npm run build` | Type-check and build the production bundle |
| Frontend | `npm run lint` | Run Oxlint |
| Frontend | `npm run preview` | Serve the production build |
| Backend | `npm run typecheck` | Type-check without emitting files |
| Backend | `npm run build` | Compile to `dist/` |
| Backend | `npm start` | Run the compiled server |

## Run everything with Docker Compose

From the repo root:

```bash
docker compose up
```

| Service | URL |
| --- | --- |
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |
| Postgres | localhost:5432 |

Compose installs dependencies inside the containers and runs each app in dev mode. Source folders are mounted, so edits on the host are picked up by the dev servers.
