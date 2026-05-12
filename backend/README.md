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

6. Seed Nigeria network geography:

```bash
npm run prisma:seed
```

The seed loads Nigeria, 37 states including FCT, and 774 local government areas from the public SQL source at `davepartner/sql-list-of-local-governments-and-states-in-Nigeria`. LGAs are stored as `LocalArea` records under one default statewide `City` per state, matching the current hub `cityId` and `localAreaId` model.

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

Partner shop registration can include map-provider metadata captured by the UI from Google Places or a similar address lookup. The partner does not type the place id directly; the UI sends it with the selected address:

```json
{
  "name": "Ikeja Pickup Partner",
  "contactName": "Amina Bello",
  "phone": "08030000000",
  "hubPublicId": "HUB-TEST000000",
  "address": {
    "line1": "12 Allen Avenue",
    "freeformCity": "Ikeja",
    "freeformState": "Lagos",
    "localAreaId": "local-area-id",
    "latitude": 6.6018,
    "longitude": 3.3515,
    "googlePlaceId": "ChIJ2Y1b3YOOxRARKGZLG0e7XGQ",
    "formattedAddress": "12 Allen Avenue, Ikeja, Lagos, Nigeria"
  }
}
```

Session-scoped endpoints:

- `GET /api/v1/me`
- `GET /api/v1/businesses/:publicId`
- `GET /api/v1/hubs/:publicId`
- `GET /api/v1/partners/drivers/:publicId`

Application approval endpoints assign operational codes and activate pending applications:

- `POST /api/v1/merchants/:publicId/approve`
- `POST /api/v1/partners/shops/:publicId/approve`
- `POST /api/v1/partners/drivers/:publicId/approve`

## Docker

From the repository root:

```bash
docker compose up --build
```

This starts PostgreSQL, Redis, runs Prisma migrations, and starts the API.
