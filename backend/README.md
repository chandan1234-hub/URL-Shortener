# Backend

The backend uses Express and Prisma ORM with PostgreSQL 15 or newer.

## Database setup

1. Set `DATABASE_URL` in `.env` to your PostgreSQL connection string. For a new setup, start from `.env.example`.
2. Define models in [`src/prisma/contract.prisma`](src/prisma/contract.prisma).
3. Run `npm run contract:emit` to generate the contract files.
4. Run `npm run db:init` to create the contract's tables in the configured database. This command is additive and stops on incompatible changes.

## Development

- `npm run dev` — start the Express server.
- `npm run typecheck` — type-check the backend.
- `npm run build` — compile the backend.
