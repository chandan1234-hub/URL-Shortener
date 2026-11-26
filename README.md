# URL Shortener

A TypeScript URL shortener with a React and Vite frontend, an Express API, and
PostgreSQL storage through Prisma.

## Run with Docker Compose

Docker Compose starts the frontend and API. Short URL creation and redirects
require an existing PostgreSQL 15+ database provisioned with the schema
expected by the backend; Compose does not create one. Set `DATABASE_URL` in the
environment before starting the stack. It must use a hostname reachable from
inside the backend container. For a database running on the host with Docker
Desktop, use `host.docker.internal` instead of `localhost`.

In PowerShell:

```powershell
$env:DATABASE_URL = "postgresql://user:password@host.docker.internal:5432/shortener"
docker compose up --build
```

In Bash:

```sh
export DATABASE_URL="postgresql://user:password@db-host:5432/shortener"
docker compose up --build
```

Open the frontend at <http://localhost:5173>. The API is available at
<http://localhost:3000>. The frontend uses `http://localhost:3000` by default;
to target another API origin, set `VITE_API_URL` to a URL reachable by the
browser and rebuild the frontend with `docker compose up --build`.

The API health check can pass without `DATABASE_URL`, but creating or resolving
short URLs will fail until the database is configured.
