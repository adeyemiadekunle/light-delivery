# Asset-Light Delivery Backend

NestJS backend for the asset-light delivery network.

## Stack

- NestJS and TypeScript
- Prisma and PostgreSQL
- Redis and BullMQ
- Jest
- OpenAPI docs at `/api/docs`

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
npm test
npm run start:dev
```

Health endpoints:

- `GET /api/v1/health/live`
- `GET /api/v1/health/version`
