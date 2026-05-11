# Asset-Light Delivery Backend

NestJS backend for the asset-light delivery network.

## Stack

- NestJS and TypeScript
- Prisma and PostgreSQL
- Redis and BullMQ
- Jest
- OpenAPI/Swagger docs

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
copy .env.example .env
```

3. Start PostgreSQL and Redis locally.

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Run migrations when a database is available:

```bash
npm run prisma:migrate
```

## Common Commands

```bash
npm run build
npm run lint
npm run format:check
npm test
npm run start:dev
```

Health endpoints:

- `GET /api/v1/health/live`
- `GET /api/v1/health/version`

API documentation:

- Swagger UI: `GET /api/docs`
- OpenAPI JSON: `GET /api/docs-json`

The OpenAPI document includes bearer auth, current controller routes, and DTO schemas for request bodies.

## Docker

From the repository root:

```bash
docker compose up --build
```

This starts PostgreSQL, Redis, runs Prisma migrations, and starts the API.
