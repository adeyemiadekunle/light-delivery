# light-delivery

Backend platform for an asset-light delivery network.

## Current Backend Stack

- NestJS and TypeScript
- Prisma and PostgreSQL
- Redis and BullMQ
- Jest
- OpenAPI docs

The backend lives in `backend/`.

## Local Docker

Start Postgres, Redis, run migrations, and start the API:

```bash
docker compose up --build
```

API health check:

```bash
curl http://localhost:3000/api/v1/health/live
```
