# Backend

The backend is a TypeScript Express API backed by PostgreSQL through Prisma ORM.

## Configuration

Set `DATABASE_URL` to a PostgreSQL connection string before creating or resolving
short URLs. `PUBLIC_URL` is optional and sets the base URL returned when creating
a short link; otherwise, the request's protocol and host are used. `PORT` and
`HOST` configure the HTTP server.

## Development

- `npm install` — install dependencies.
- `npm run dev` — start the API with watch mode.
- `npm run scale:dev` — start the Fastify API variant with watch mode on port 3001.
- `npm run benchmark` — load-test the running API's `GET /health` endpoint
  with Autocannon (100 concurrent connections for 10 seconds). Start the API
  first with `npm run dev` or `npm start`.
- `npm run typecheck` — type-check the backend.
- `npm run build` — compile the backend to `dist/`.

The API exposes `GET /health`, `POST /api/shorten` with a JSON body containing a
valid HTTP(S) `url`, and `GET /:shortCode` to redirect to the saved destination.
Invalid request bodies return `400`; unknown and expired links return `404` and
`410`, respectively.
