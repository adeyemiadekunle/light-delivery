# Asset-Light Delivery Backend Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full NestJS backend platform for the asset-light delivery network with Prisma, PostgreSQL, Redis, BullMQ, idempotency, monitoring, and the core logistics domains.

**Architecture:** One modular NestJS monolith with separate domain modules for identity, network, partners, parcels, custody, manifests, delivery, wallets, settlements, notifications, offline sync, risk, exceptions, monitoring, and admin APIs. PostgreSQL is the durable source of truth, Redis backs BullMQ queues and short-lived locks, and all retryable write paths use durable idempotency records.

**Tech Stack:** NestJS, TypeScript, Prisma, PostgreSQL, Redis, BullMQ, Jest, OpenAPI/Swagger, class-validator, bcrypt, JWT.

---

## File Structure

Create the backend under `backend/`.

- `backend/package.json`: scripts and dependencies.
- `backend/src/main.ts`: Nest bootstrap, validation pipe, API prefix, Swagger.
- `backend/src/app.module.ts`: root module wiring.
- `backend/src/config/*`: typed environment configuration.
- `backend/src/prisma/*`: Prisma service and database lifecycle.
- `backend/src/common/*`: decorators, guards, interceptors, filters, ids, pagination, errors.
- `backend/src/common/ids/*`: internal helpers for public id and tracking code generation.
- `backend/src/monitoring/*`: health, readiness, metrics, queue status, version metadata.
- `backend/src/jobs/*`: BullMQ queues, worker registration, job logging.
- `backend/src/idempotency/*`: durable idempotency records and Redis lock helpers.
- `backend/src/addresses/*`: reusable address records with optional postcode and GPS.
- `backend/src/identity/*`: users, auth, roles, permissions, JWT.
- `backend/src/network/*`: countries, states, cities, local areas, hubs, service areas, routes.
- `backend/src/partners/*`: partner shops, vehicles, drivers, compliance documents.
- `backend/src/customers/*`: sender/receiver profiles and address books.
- `backend/src/merchants/*`: merchant profiles, merchant users, credit accounts.
- `backend/src/pricing/*`: delivery pricing rules and quote calculation.
- `backend/src/parcels/*`: bookings, waybills, parcel status, tracking.
- `backend/src/custody/*`: scan events, handovers, custody validation.
- `backend/src/manifests/*`: route, sweep, and linehaul manifests.
- `backend/src/delivery/*`: OTP pickup, proof of delivery, failed delivery, returns.
- `backend/src/wallets/*`: wallet ledger, payments, invoices, credit.
- `backend/src/settlements/*`: partner earnings, payout holds, reconciliation.
- `backend/src/notifications/*`: notification commands, provider adapters, BullMQ workers.
- `backend/src/offline-sync/*`: device registration, sync batches, event replay.
- `backend/src/exceptions/*`: missing, damaged, delayed, misrouted, claims.
- `backend/src/risk/*`: risk flags, anomaly checks, review workflow.
- `backend/src/admin/*`: control tower APIs and reporting endpoints.
- `backend/prisma/schema.prisma`: full relational model.
- `backend/prisma/seed.ts`: Lagos/Abuja seed network and admin user.
- `backend/test/*`: integration test setup.

## Task 1: Scaffold the Backend Project

**Files:**
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/tsconfig.build.json`
- Create: `backend/nest-cli.json`
- Create: `backend/jest.config.ts`
- Create: `backend/.env.example`
- Create: `backend/src/main.ts`
- Create: `backend/src/app.module.ts`
- Create: `backend/src/app.controller.ts`
- Create: `backend/src/app.service.ts`

- [ ] **Step 1: Create the package manifest**

```json
{
  "name": "asset-light-delivery-backend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "lint": "eslint \"src/**/*.ts\" \"test/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@nestjs/bullmq": "^10.2.3",
    "@nestjs/common": "^10.4.15",
    "@nestjs/config": "^3.3.0",
    "@nestjs/core": "^10.4.15",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/platform-express": "^10.4.15",
    "@nestjs/swagger": "^8.1.0",
    "@prisma/client": "^6.1.0",
    "bcrypt": "^5.1.1",
    "bullmq": "^5.34.2",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "ioredis": "^5.4.2",
    "nanoid": "^5.0.9",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.4.8",
    "@nestjs/schematics": "^10.2.3",
    "@nestjs/testing": "^10.4.15",
    "@types/bcrypt": "^5.0.2",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.14",
    "@types/node": "^22.10.2",
    "@types/passport-jwt": "^4.0.1",
    "@typescript-eslint/eslint-plugin": "^8.18.1",
    "@typescript-eslint/parser": "^8.18.1",
    "eslint": "^9.17.0",
    "jest": "^29.7.0",
    "prisma": "^6.1.0",
    "source-map-support": "^0.5.21",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5",
    "ts-loader": "^9.5.1",
    "ts-node": "^10.9.2",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

- [ ] **Step 2: Create TypeScript and Nest config files**

Create `backend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts", "test/**/*.ts", "prisma/**/*.ts"]
}
```

Create `backend/tsconfig.build.json`:

```json
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}
```

Create `backend/nest-cli.json`:

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
```

- [ ] **Step 3: Create the basic app bootstrap**

Create `backend/src/main.ts`:

```typescript
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Asset-Light Delivery API')
    .setDescription('Backend API for the asset-light delivery network')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();

  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}

void bootstrap();
```

Create `backend/src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Create `backend/src/app.controller.ts`:

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot() {
    return this.appService.getRoot();
  }
}
```

Create `backend/src/app.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoot() {
    return {
      name: 'asset-light-delivery-backend',
      status: 'ok',
    };
  }
}
```

- [ ] **Step 4: Run the first build**

Run: `cd backend && npm install && npm run build`

Expected: dependencies install and TypeScript build succeeds.

## Task 2: Add Prisma, PostgreSQL Models, and Seeds

**Files:**
- Create: `backend/prisma/schema.prisma`
- Create: `backend/prisma/seed.ts`
- Create: `backend/src/prisma/prisma.module.ts`
- Create: `backend/src/prisma/prisma.service.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: Write the Prisma service test**

Create `backend/src/prisma/prisma.service.spec.ts`:

```typescript
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  it('is defined', () => {
    const service = new PrismaService();
    expect(service).toBeDefined();
  });
});
```

Run: `cd backend && npm test -- prisma.service.spec.ts`

Expected: FAIL because `prisma.service.ts` does not exist yet.

- [ ] **Step 2: Create Prisma schema foundation**

Create `backend/prisma/schema.prisma` with enums and models for users, roles, network, partners, parcels, custody events, manifests, wallets, settlements, notifications, sync, idempotency, monitoring, exceptions, risk, and audit logs. Use UUID primary keys, `createdAt`, and `updatedAt` on mutable records.

The first implementation must include these minimum models: `User`, `Role`, `Permission`, `UserRole`, `Country`, `State`, `City`, `LocalArea`, `Hub`, `PartnerShop`, `PartnerVehicle`, `Driver`, `Customer`, `Merchant`, `Parcel`, `ParcelItem`, `PricingRule`, `CustodyEvent`, `Manifest`, `ManifestParcel`, `Route`, `RouteStop`, `DeliveryAttempt`, `PickupOtp`, `Wallet`, `WalletTransaction`, `Payment`, `SettlementEntry`, `NotificationMessage`, `SyncDevice`, `SyncBatch`, `IdempotencyKey`, `JobRun`, `SystemHealthEvent`, `ExceptionCase`, `Claim`, `RiskFlag`, and `AuditLog`.

- [ ] **Step 3: Create Prisma service**

Create `backend/src/prisma/prisma.service.ts`:

```typescript
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

Create `backend/src/prisma/prisma.module.ts`:

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

Modify `backend/src/app.module.ts` to import `PrismaModule`.

- [ ] **Step 4: Verify Prisma service test passes**

Run: `cd backend && npm test -- prisma.service.spec.ts`

Expected: PASS.

## Task 3: Add Redis, BullMQ, Jobs, and Monitoring Foundation

**Files:**
- Create: `backend/src/jobs/jobs.module.ts`
- Create: `backend/src/jobs/queue-names.ts`
- Create: `backend/src/jobs/job-run.service.ts`
- Create: `backend/src/monitoring/monitoring.module.ts`
- Create: `backend/src/monitoring/health.controller.ts`
- Create: `backend/src/monitoring/health.service.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: Write health service tests**

Create `backend/src/monitoring/health.service.spec.ts`:

```typescript
import { HealthService } from './health.service';

describe('HealthService', () => {
  it('returns live status', () => {
    const service = new HealthService();
    expect(service.getLive()).toEqual({ status: 'live' });
  });
});
```

Run: `cd backend && npm test -- health.service.spec.ts`

Expected: FAIL because monitoring files do not exist yet.

- [ ] **Step 2: Add queue names**

Create `backend/src/jobs/queue-names.ts`:

```typescript
export const QUEUE_NAMES = {
  notifications: 'notifications',
  payments: 'payments',
  settlements: 'settlements',
  sync: 'sync',
  operations: 'operations',
  risk: 'risk',
  reports: 'reports',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];
```

- [ ] **Step 3: Add health service and controller**

Create `backend/src/monitoring/health.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getLive() {
    return { status: 'live' };
  }

  getVersion() {
    return {
      name: 'asset-light-delivery-backend',
      version: process.env.npm_package_version ?? '0.1.0',
      nodeEnv: process.env.NODE_ENV ?? 'development',
    };
  }
}
```

Create `backend/src/monitoring/health.controller.ts`:

```typescript
import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('live')
  live() {
    return this.healthService.getLive();
  }

  @Get('version')
  version() {
    return this.healthService.getVersion();
  }
}
```

Create `backend/src/monitoring/monitoring.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService],
})
export class MonitoringModule {}
```

- [ ] **Step 4: Wire jobs and monitoring modules**

Create `backend/src/jobs/jobs.module.ts`:

```typescript
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QUEUE_NAMES } from './queue-names';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),
    BullModule.registerQueue(
      ...Object.values(QUEUE_NAMES).map((name) => ({ name })),
    ),
  ],
  exports: [BullModule],
})
export class JobsModule {}
```

Modify `backend/src/app.module.ts` to import `JobsModule` and `MonitoringModule`.

- [ ] **Step 5: Verify health test passes**

Run: `cd backend && npm test -- health.service.spec.ts`

Expected: PASS.

## Task 4: Add Durable Idempotency

**Files:**
- Create: `backend/src/idempotency/idempotency.module.ts`
- Create: `backend/src/idempotency/idempotency.service.ts`
- Create: `backend/src/idempotency/dto/idempotency-result.dto.ts`
- Modify: `backend/prisma/schema.prisma`

- [ ] **Step 1: Write idempotency service test**

Create `backend/src/idempotency/idempotency.service.spec.ts`:

```typescript
import { IdempotencyService } from './idempotency.service';

describe('IdempotencyService', () => {
  it('creates a deterministic conflict key from actor, scope, and key', () => {
    const service = new IdempotencyService({} as never);
    expect(service.buildLookupKey('user-1', 'parcel-booking', 'abc')).toBe('user-1:parcel-booking:abc');
  });
});
```

Run: `cd backend && npm test -- idempotency.service.spec.ts`

Expected: FAIL because service does not exist.

- [ ] **Step 2: Create service**

Create `backend/src/idempotency/idempotency.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IdempotencyService {
  constructor(private readonly prisma: PrismaService) {}

  buildLookupKey(actorId: string, scope: string, key: string) {
    return `${actorId}:${scope}:${key}`;
  }
}
```

Create `backend/src/idempotency/idempotency.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { IdempotencyService } from './idempotency.service';

@Module({
  providers: [IdempotencyService],
  exports: [IdempotencyService],
})
export class IdempotencyModule {}
```

- [ ] **Step 3: Verify idempotency test passes**

Run: `cd backend && npm test -- idempotency.service.spec.ts`

Expected: PASS.

## Task 4A: Add Public IDs and Address Location Rules

**Files:**
- Modify: `backend/prisma/schema.prisma`
- Create: `backend/src/common/ids/public-id.service.ts`
- Test: `backend/src/common/ids/public-id.service.spec.ts`
- Modify: `backend/src/network/dto/create-hub.dto.ts`
- Modify: `backend/src/network/hubs.service.ts`
- Modify: `backend/src/network/hubs.service.spec.ts`
- Modify: `backend/src/parcels/dto/create-parcel.dto.ts`
- Modify: `backend/src/parcels/parcels.service.ts`

- [ ] **Step 1: Write failing tests**

Add a test proving `PublicIdService` creates prefixed public ids:

```typescript
expect(service.generateUserId()).toMatch(/^USR-[A-Z0-9]{12}$/);
expect(service.generateBusinessId()).toMatch(/^BUS-[A-Z0-9]{12}$/);
```

Add a test proving hub creation rejects missing GPS coordinates:

```typescript
expect(() =>
  service.validateCreateInput({ name: 'Ikeja Hub', code: 'LOS-IKEJA', cityId: 'city-1' } as never),
).toThrow(BadRequestException);
```

- [ ] **Step 2: Implement public id generation**

Create `PublicIdService` with `USR-`, `CUS-`, and `BUS-` prefixed ids. Store public ids separately from internal UUID ids in the Prisma schema.

- [ ] **Step 3: Add postcode and GPS fields**

Add optional postcode fields to address-bearing records. Add optional GPS fields for users, customers, receivers, businesses, partner shops, and hubs.

- [ ] **Step 4: Verify**

Run:

```bash
cd backend
npm run prisma:generate
npm test
npm run build
```

Expected: Prisma client generation succeeds, all tests pass, and the backend builds.

## Task 5: Build Identity and RBAC

**Files:**
- Create: `backend/src/identity/identity.module.ts`
- Create: `backend/src/identity/auth.controller.ts`
- Create: `backend/src/identity/auth.service.ts`
- Create: `backend/src/identity/password.service.ts`
- Create: `backend/src/identity/jwt.strategy.ts`
- Create: `backend/src/identity/guards/jwt-auth.guard.ts`
- Create: `backend/src/identity/guards/roles.guard.ts`
- Create: `backend/src/identity/decorators/roles.decorator.ts`
- Create: `backend/src/identity/dto/login.dto.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: Write password hashing test**

Create `backend/src/identity/password.service.spec.ts`:

```typescript
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  it('verifies a password against its hash', async () => {
    const service = new PasswordService();
    const hash = await service.hash('strong-password');
    await expect(service.verify('strong-password', hash)).resolves.toBe(true);
    await expect(service.verify('wrong-password', hash)).resolves.toBe(false);
  });
});
```

Run: `cd backend && npm test -- password.service.spec.ts`

Expected: FAIL because service does not exist.

- [ ] **Step 2: Create password service**

Create `backend/src/identity/password.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  async hash(password: string) {
    return bcrypt.hash(password, 12);
  }

  async verify(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
```

- [ ] **Step 3: Verify password test passes**

Run: `cd backend && npm test -- password.service.spec.ts`

Expected: PASS.

## Task 6: Build Network and Partner Foundations

**Files:**
- Create: `backend/src/network/network.module.ts`
- Create: `backend/src/network/hubs.controller.ts`
- Create: `backend/src/network/hubs.service.ts`
- Create: `backend/src/network/dto/create-hub.dto.ts`
- Create: `backend/src/partners/partners.module.ts`
- Create: `backend/src/partners/partner-shops.service.ts`
- Create: `backend/src/partners/partner-vehicles.service.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: Write hub validation test**

Create `backend/src/network/hubs.service.spec.ts`:

```typescript
import { BadRequestException } from '@nestjs/common';
import { HubsService } from './hubs.service';

describe('HubsService', () => {
  it('rejects a hub without a city id', () => {
    const service = new HubsService({} as never);
    expect(() => service.validateCreateInput({ name: 'Ikeja Hub', code: 'LOS-IKEJA' } as never)).toThrow(BadRequestException);
  });
});
```

Run: `cd backend && npm test -- hubs.service.spec.ts`

Expected: FAIL because service does not exist.

- [ ] **Step 2: Create hub DTO and service validation**

Create `backend/src/network/dto/create-hub.dto.ts`:

```typescript
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHubDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  cityId!: string;
}
```

Create `backend/src/network/hubs.service.ts`:

```typescript
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHubDto } from './dto/create-hub.dto';

@Injectable()
export class HubsService {
  constructor(private readonly prisma: PrismaService) {}

  validateCreateInput(input: CreateHubDto) {
    if (!input.cityId) {
      throw new BadRequestException('cityId is required');
    }
  }
}
```

- [ ] **Step 3: Verify hub validation test passes**

Run: `cd backend && npm test -- hubs.service.spec.ts`

Expected: PASS.

## Task 7: Build Parcel Booking, Pricing, and Tracking

**Files:**
- Create: `backend/src/pricing/pricing.module.ts`
- Create: `backend/src/pricing/pricing.service.ts`
- Create: `backend/src/parcels/parcels.module.ts`
- Create: `backend/src/parcels/parcels.controller.ts`
- Create: `backend/src/parcels/parcels.service.ts`
- Create: `backend/src/parcels/waybill.service.ts`
- Create: `backend/src/parcels/parcels.service.spec.ts`
- Create: `backend/src/parcels/tracking.controller.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: Write waybill generation test**

Create `backend/src/parcels/waybill.service.spec.ts`:

```typescript
import { WaybillService } from './waybill.service';

describe('WaybillService', () => {
  it('generates a Nigerian delivery waybill with ALD prefix', () => {
    const service = new WaybillService();
    expect(service.generate('LOS')).toMatch(/^ALD-LOS-[A-Z0-9]{10}$/);
  });
});
```

Run: `cd backend && npm test -- waybill.service.spec.ts`

Expected: FAIL because service does not exist.

- [ ] **Step 2: Create waybill service**

Create `backend/src/parcels/waybill.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 10);

@Injectable()
export class WaybillService {
  generate(originCode: string) {
    return `ALD-${originCode}-${nanoid()}`;
  }
}
```

- [ ] **Step 3: Verify waybill test passes**

Run: `cd backend && npm test -- waybill.service.spec.ts`

Expected: PASS.

- [ ] **Step 4: Require sender return details on every parcel**

Add parcel creation validation that rejects bookings without sender return name, phone, and address:

```typescript
expect(() =>
  service.validateCreateInput({
    senderName: 'Amina Store',
    senderPhone: '08030000000',
  } as never),
).toThrow(BadRequestException);
```

Persist sender return snapshots using related `Address` records. Parcel still stores sender name and phone directly for quick operational lookup, while the return address line, optional postcode, and optional GPS live in the sender snapshot address.

## Task 7A: Promote Addresses to First-Class Records

**Files:**
- Modify: `backend/prisma/schema.prisma`
- Modify: `backend/src/parcels/parcels.service.ts`
- Modify: `backend/src/parcels/parcels.service.spec.ts`
- Modify: `backend/src/network/hubs.service.ts`
- Modify: `backend/src/network/hubs.service.spec.ts`

- [ ] **Step 1: Add the Address model**

Create an `Address` Prisma model with `type`, `line1`, optional `line2`, optional `postcode`, optional GPS fields, optional contact fields, and ownership links for customer, merchant, hub, partner shop, parcel sender snapshot, and parcel receiver snapshot.

- [ ] **Step 2: Move parcel sender/receiver address snapshots to Address**

Parcel booking should still accept simple sender/receiver address fields, but `ParcelsService` must create related address records for sender and receiver snapshots instead of storing ad hoc address columns directly on `Parcel`.

- [ ] **Step 3: Move hub address input to Address**

Hub creation should map optional address/postcode/GPS input into a related `Address` record instead of writing address columns directly to `Hub`.

- [ ] **Step 4: Verify**

Run:

```bash
cd backend
npm run prisma:generate
npm test
npm run test:e2e
npm run build
```

## Task 8: Build Custody Ledger, Manifests, and Routing

**Files:**
- Create: `backend/src/custody/custody.module.ts`
- Create: `backend/src/custody/custody.service.ts`
- Create: `backend/src/custody/dto/create-custody-event.dto.ts`
- Create: `backend/src/manifests/manifests.module.ts`
- Create: `backend/src/manifests/manifests.service.ts`
- Create: `backend/src/routing/routing.module.ts`
- Create: `backend/src/routing/routing.service.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: Write custody transition test**

Create `backend/src/custody/custody.service.spec.ts`:

```typescript
import { BadRequestException } from '@nestjs/common';
import { CustodyService } from './custody.service';

describe('CustodyService', () => {
  it('rejects a scan without a parcel id', () => {
    const service = new CustodyService({} as never);
    expect(() => service.validateScan({ eventType: 'HUB_RECEIVED' } as never)).toThrow(BadRequestException);
  });
});
```

Run: `cd backend && npm test -- custody.service.spec.ts`

Expected: FAIL because service does not exist.

- [ ] **Step 2: Create custody validation service**

Create `backend/src/custody/custody.service.ts`:

```typescript
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type ScanInput = {
  parcelId?: string;
  eventType?: string;
};

@Injectable()
export class CustodyService {
  constructor(private readonly prisma: PrismaService) {}

  validateScan(input: ScanInput) {
    if (!input.parcelId) {
      throw new BadRequestException('parcelId is required');
    }
    if (!input.eventType) {
      throw new BadRequestException('eventType is required');
    }
  }
}
```

- [ ] **Step 3: Verify custody test passes**

Run: `cd backend && npm test -- custody.service.spec.ts`

Expected: PASS.

## Task 9: Build Delivery, Wallets, Settlements, Notifications, Sync, Risk, and Admin

**Files:**
- Create module folders and first services for `delivery`, `wallets`, `settlements`, `notifications`, `offline-sync`, `exceptions`, `risk`, and `admin`.
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: Write OTP validation test**

Create `backend/src/delivery/otp.service.spec.ts`:

```typescript
import { OtpService } from './otp.service';

describe('OtpService', () => {
  it('accepts matching active OTP codes', () => {
    const service = new OtpService();
    expect(service.matches('123456', '123456')).toBe(true);
    expect(service.matches('123456', '654321')).toBe(false);
  });
});
```

Run: `cd backend && npm test -- otp.service.spec.ts`

Expected: FAIL because service does not exist.

- [ ] **Step 2: Create OTP service**

Create `backend/src/delivery/otp.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  matches(expectedCode: string, submittedCode: string) {
    return expectedCode === submittedCode;
  }
}
```

- [ ] **Step 3: Add remaining module shells**

Each module shell should export one focused service and register controllers only when an API endpoint is implemented. Start with service classes that enforce core domain rules before adding broad CRUD endpoints.

- [ ] **Step 4: Verify OTP test passes**

Run: `cd backend && npm test -- otp.service.spec.ts`

Expected: PASS.

## Task 10: Verification and Documentation

**Files:**
- Create: `backend/README.md`
- Create: `backend/test/jest-e2e.json`
- Create: `backend/test/app.e2e-spec.ts`
- Modify: `docs/superpowers/plans/2026-05-10-full-backend-platform.md`

- [ ] **Step 1: Add README**

Create `backend/README.md` with setup, environment variables, local PostgreSQL/Redis requirements, common scripts, and API docs path.

- [ ] **Step 2: Add e2e smoke test**

Create `backend/test/app.e2e-spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/v1/health/live returns live status', () => {
    return request(app.getHttpServer()).get('/api/v1/health/live').expect(200).expect({
      status: 'live',
    });
  });
});
```

- [ ] **Step 3: Run full verification**

Run:

```bash
cd backend
npm run build
npm test
```

Expected: build succeeds and all tests pass.
