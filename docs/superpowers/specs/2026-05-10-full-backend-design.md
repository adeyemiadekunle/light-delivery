# Asset-Light Delivery Full Backend Design

## Purpose

Build the full backend platform for an asset-light delivery network in Nigeria using a NestJS modular monolith, Prisma, and PostgreSQL. The platform must control booking, pricing, custody, manifests, routing, wallet flows, partner settlement, notifications, offline sync, exceptions, fraud controls, and admin operations.

The business is asset-light, but the backend must be control-heavy. The company may not own vans or shops at launch, but the platform must own the operational rules, evidence trail, financial controls, and customer trust layer.

## Architecture Decision

Use one deployable NestJS API organized as independent domain modules. Each module owns its controllers, services, DTOs, guards where needed, and Prisma-backed persistence logic. Shared infrastructure such as configuration, authentication utilities, database access, idempotency, audit logging, and event dispatch lives in clearly named shared modules.

This avoids early microservice complexity while keeping the codebase split along real operational boundaries. The system can later split high-volume domains, such as notifications or settlement, without changing the product model.

## Technology Stack

- Runtime: Node.js with NestJS and TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Queue and cache: Redis
- Background jobs: BullMQ
- Auth: JWT access tokens with refresh-token support
- Validation: class-validator and class-transformer
- API docs: OpenAPI/Swagger generated from NestJS decorators, served at `/api/docs` with JSON at `/api/docs-json`
- Testing: Jest with unit and integration tests
- Monitoring: structured logs, health checks, metrics, queue visibility, and error reporting hooks
- External integrations: payment provider, SMS, WhatsApp, and email adapters behind provider interfaces

## Core Backend Modules

### Identity

Handles users, staff accounts, passwords, sessions, JWT tokens, refresh tokens, roles, permissions, and access guards.

Key roles include platform admin, operations manager, hub staff, driver, partner owner, merchant admin, merchant staff, customer support, finance reviewer, and risk reviewer.

Users must have a private internal UUID primary key and a separate non-sequential public user id. Internal ids are used for joins and authorization checks. Public ids are used in URLs, support workflows, exports, and external references.

`User` is the security identity: login, password, session, roles, permissions, and audit actor. It is not the business profile itself.

### Customers

Handles individual senders, receiver records, saved addresses, contact details, and customer-level booking history.

Customer address records support optional postcode, optional latitude, and optional longitude. GPS is useful when available, but customers must not be blocked from booking because postcode coverage and address quality are uneven today.

`Customer` is the personal sender/receiver profile. A customer may be linked to a user account, but keeping it separate lets the platform support assisted bookings, receivers who never log in, and future cases where one login manages multiple profiles.

The customer module must create customer public ids and can attach one or more first-class address records to the customer profile.

### Merchants

Handles business accounts, merchant users, business profiles, credit eligibility, volume rules, reporting access, and business address books.

Business accounts must have private internal UUID ids and separate non-sequential public business ids. Business addresses support optional postcode and optional GPS coordinates.

`Merchant` is the business account: credit terms, business reporting, staff users, bulk rules, and settlement-facing identity. It stays separate from `User` because a business can have many users and one user may later belong to multiple businesses.

The merchant module must create business public ids and can attach one or more first-class address records to the business account.

### Addresses

Addresses are first-class records instead of repeated text columns. Address records store line fields, optional postcode, optional GPS, optional contact name/phone, and ownership links for customers, merchants, hubs, partner shops, and parcel sender/receiver snapshots.

Parcel sender and receiver addresses are stored as snapshot address records linked to the parcel. This preserves return-to-sender and delivery evidence even if the customer's or merchant's saved address changes later.

### Network

Models the physical operating network: countries, states, cities, local areas, hubs, service areas, route zones, pickup points, and failed-delivery collection hubs. Lockers are out of scope for the current build and can be added later as a separate location type.

Local hubs should support GPS latitude and longitude because customers, drivers, and operations staff benefit from reliable pickup and drop-off location discovery. Hub GPS and postcode are optional so onboarding can proceed even when exact location data is not available yet, while preserving future compatibility with improved government postcode systems. Hub creation should accept the city and local-area ids, resolve the city/local-area codes server-side, and generate the hub operational code from those location codes plus the next local-area sequence. Callers should not submit hub operational codes. Location finder features should use Google Maps or another map provider against hub and partner-shop GPS coordinates instead of relying on postcodes.

The seed process should load Nigeria as the default country, the 37 Nigerian states including FCT, and local government areas as local-area records. With the current schema, each state is represented by one default statewide city so LGAs can be attached as local areas while preserving the existing `Hub.cityId` and `Hub.localAreaId` contract.

### Partners

Handles partner shops, partner vans, drivers, KYC records, compliance documents, insurance details, vehicle records, contract status, suspension status, and operational eligibility.

Partner shops can have first-class address records and compliance documents such as business registration or government ID. Each partner shop can be linked to its controlling hub so operations can group partner pickup/drop-off points under a hub. Partner shop creation should accept the controlling hub public id, resolve the internal hub relation server-side, and generate the partner shop operational code from the hub code and next hub-local sequence. Callers should not submit partner shop codes or internal hub ids. Partner shops should expose service capability flags for drop-off, pickup, returns, print-in-shop, and digital receipts, plus structured opening hours. Their GPS coordinates live on the related address record and power Google/map-based location finder features. Partner vehicles can belong to partner shops and carry vehicle insurance, roadworthiness, and license documents. Drivers can be linked to platform users later and must support driver-license and identity documents. Compliance documents start as pending and can be verified, rejected, or marked expired by operations/risk teams.

### Pricing

Calculates delivery charges using service type, origin, destination, weight, volumetric weight, distance or zone, insurance, pickup add-ons, doorstep add-ons, bulk discounts, surcharges, and merchant rules.

### Parcels

Handles bookings, waybill numbers, parcel items, sender and receiver details, service type, declared value, parcel dimensions, parcel status, and tracking code generation.

Public parcel tracking codes should be 16 uppercase alphanumeric characters and remain separate from internal parcel ids and waybill numbers. Public tracking responses may expose tracking code, waybill number, service type, parcel status, and a timestamped event timeline. They must not expose internal parcel ids, actor ids, hub ids, manifest ids, phone numbers, addresses, internal notes, evidence payloads, validation payloads, risk flags, or settlement details.

Every parcel must snapshot sender return details at booking time, whether the sender is an individual or a business. Required sender return fields are sender name, sender phone, and sender address. Sender postcode and GPS are optional. This ensures failed delivery, rejected delivery, and return-to-sender flows can work even if the linked customer or merchant profile later changes.

### Custody

Maintains the append-only custody ledger. Every operational movement creates a scan or custody event with actor, location, device, timestamp, event type, evidence, and validation result.

No parcel movement is considered valid unless the custody ledger supports it.

### Manifests

Handles grouped movement of parcels through sweep, route, and linehaul manifests. Manifests contain seal numbers, origin hub, destination hub or route, assigned vehicle, assigned driver, parcel list, departure evidence, arrival evidence, and reconciliation state.

### Routing

Handles scheduled routes, route stops, lanes, hub-to-hub movement, intra-city sweeps, intercity trunks, operating calendars, route capacity, route status, and route validation rules.

### Delivery

Handles OTP pickup, doorstep delivery attempts, proof of delivery, receiver verification, failed delivery, return-to-hub, return-to-sender, and delivery exception transitions.

### Wallets

Handles prepaid balances, transaction ledger, payment records, merchant credit usage, invoice records, refunds, adjustments, and balance holds.

### Settlements

Handles partner earnings, scan-proof-based settlement eligibility, payout holds, deductions, dispute holds, reconciliation, payout batches, and finance approval.

### Notifications

Handles SMS, WhatsApp, and email notification requests through provider adapters. Notification events are logged with delivery status and retry state.

Notification sends run through BullMQ workers so transient provider failures can be retried without blocking API requests.

### Offline Sync

Supports hub and driver apps operating with weak internet. Devices submit queued events with idempotency keys. The backend validates, stores, deduplicates, and replays events safely.

### Exceptions

Handles damaged, missing, delayed, misrouted, rejected, unclaimed, and disputed parcels. Exception records link to custody events, claims, evidence, assigned owners, and resolution outcomes.

### Risk

Detects and records fraud signals such as impossible scans, repeated failed OTP attempts, route mismatch, weight mismatch, suspicious voids, blocked actors, and partner compliance failures.

### Admin

Provides control tower APIs for operations, finance, support, and risk teams. Admin actions that override normal flows must always write audit records.

### Jobs and Queues

Provides BullMQ queues and workers for asynchronous work: notification delivery, payment confirmation polling, settlement calculation, payout batch preparation, offline sync processing, route reconciliation, stale parcel checks, failed-delivery reminders, and risk scans.

Jobs must be named, retryable, observable, and idempotent. Each job should write durable records for business outcomes in PostgreSQL, not rely on Redis as the permanent source of truth.

### Idempotency

Provides shared request and event idempotency. API clients and offline devices can submit idempotency keys for write operations. The backend stores durable idempotency records in PostgreSQL and may use Redis for short-lived locks and fast duplicate suppression.

Idempotency must protect parcel booking, payment callbacks, wallet ledger writes, custody scans, manifest events, offline sync batches, and notification enqueueing.

### Monitoring

Provides backend observability across API health, database health, Redis health, queue backlog, worker failures, job retry counts, request latency, error rate, custody-event rejection rate, payment callback failures, notification failures, and offline sync conflicts.

Monitoring should expose machine-readable health and metrics endpoints and write structured logs with request ids, actor ids where available, parcel ids where relevant, and queue job ids for asynchronous work.

## Primary End-to-End Flow

1. A sender or merchant creates a booking.
2. Pricing calculates a charge and records the pricing breakdown.
3. Payment is prepaid, wallet-funded, or approved against merchant credit.
4. The system issues a waybill and tracking code.
5. Origin hub staff scan the parcel as received.
6. The parcel is scanned into a manifest.
7. A route or linehaul manifest departs with driver, vehicle, seal, and parcel evidence.
8. Destination hub or route stop scans arrival.
9. Parcel becomes available for receiver pickup or doorstep delivery.
10. Receiver pickup requires OTP or approved identity verification.
11. Doorstep delivery requires proof of delivery or failed-delivery evidence.
12. Settlement becomes eligible only after required proof events exist.
13. Receiver-facing tracking shows safe tracking events without exposing internal risk details.

## Critical Business Rules

- Every parcel must have a waybill number before entering custody.
- Every parcel must store sender return name, phone, and address before booking is accepted.
- Every custody transition must create an append-only custody event.
- Manifest departure is blocked until required parcel scans, vehicle assignment, driver assignment, and seal data exist.
- Destination scans must validate state, city, local area, hub, route, and manifest rules.
- Offline events must be idempotent and replay-safe.
- Queue jobs must be idempotent and safe to retry.
- OTP pickup must verify the expected parcel, receiver channel, and active pickup window.
- Partner settlement must wait for verified scans, proof events, and reconciliation checks.
- Admin overrides must include actor, reason, timestamp, affected record, and audit trail.
- Public tracking must hide internal fraud flags, settlement data, financial records, and staff-only notes.
- External APIs must expose public ids where possible and avoid leaking internal database ids.
- Session identifiers and access tokens must never be placed in URLs. Business, hub, driver, and user routes should use public ids or short codes in the path, then authorize access from the authenticated session, JWT claims, roles, and ownership or assignment records.
- Postcode fields are optional on address-bearing records.
- GPS fields are optional across users, customers, businesses, receivers, partner shops, and hubs.
- Hubs must belong to a local area so routing, pickup grouping, service coverage, and partner assignment can be resolved by local operating zone.

## Data Model Overview

The database should center on operational truth and auditability.

Core tables:

- users, roles, permissions, sessions
- public ids for users, customers, and business accounts
- addresses
- customers
- merchants, merchant_users, merchant_credit_accounts
- countries, states, cities, local_areas, hubs, service_areas
- partner_shops, partner_vehicles, drivers, partner_documents
- pricing_zones, pricing_rules, surcharges, insurance_rules
- parcels, parcel_items, parcel_status_history
- custody_events, handovers, proof_assets
- routes, route_stops, route_schedules, route_capacity
- manifests, manifest_parcels, manifest_events
- delivery_attempts, pickup_otps, return_flows
- wallets, wallet_transactions, payments, invoices, credit_transactions
- settlement_entries, payout_batches, reconciliation_records
- notification_messages, notification_attempts
- sync_devices, sync_batches, idempotency_keys
- exceptions, claims, risk_flags, audit_logs
- job_runs, system_health_events

## API Design

The API should be grouped by audience and protected by role-based guards.

- Public: tracking lookup, receiver pickup verification where appropriate
- Customer: sender booking, parcel history, address book
- Merchant: business bookings, bulk booking, reporting, wallet and invoice records
- Hub staff: receive scans, handovers, pickup completion, failed-delivery updates
- Driver: route manifests, departure scans, arrival scans, proof upload
- Partner: partner profile, vehicle records, settlement visibility
- Admin: network setup, pricing setup, parcel control, exception handling, finance, risk, reporting

All write endpoints that can be retried by mobile clients or external integrations should accept idempotency keys.

External-facing URLs should follow this rule:

- `/me/*` reads the current authenticated user from the session or JWT, not a URL id.
- `/businesses/:publicId/*` uses the business public id in the path and verifies that the caller belongs to or can administer that business.
- `/hubs/:publicId/*` uses the hub public id or operational code and verifies hub staff, partner, or admin assignment.
- `/drivers/:publicId/*` uses the driver public id and verifies driver self-access, dispatch assignment, or admin role.

The public id is only a locator. Authorization must always come from the authenticated session context.

The initial implementation supports `/me`, `/businesses/:publicId`, `/hubs/:publicId`, and `/partners/drivers/:publicId` using bearer JWT verification and public-id scope claims. Business-user, hub-staff, and driver-assignment tables back those claims. Admin APIs must manage assignment lifecycle, suspension, and audit before customer-facing rollout.

Operational endpoints should include health and monitoring surfaces for internal use:

- liveness and readiness checks
- database connectivity check
- Redis connectivity check
- queue backlog and failed-job summaries
- version/build metadata
- metrics endpoint for request, job, and domain counters

## Offline Sync Design

Offline-capable clients submit signed sync batches containing ordered events. Each event includes local event id, device id, actor id, event type, parcel or manifest id, local timestamp, server received timestamp, idempotency key, and payload hash.

The backend must deduplicate repeated events, reject invalid state transitions, flag suspicious timestamp gaps, and return per-event acceptance or rejection results.

Accepted sync batches can enqueue heavier follow-up work through BullMQ, such as route reconciliation, notification fanout, and risk checks. The synchronous API response should still record the accepted or rejected state of each submitted event.

## Queue and Job Design

Redis backs BullMQ queues for asynchronous work. PostgreSQL remains the permanent record for business state. Queue workers should load business records from PostgreSQL, perform one clear job, update durable records, and exit cleanly.

Initial queues:

- notifications: SMS, WhatsApp, and email sends
- payments: provider webhook processing and payment status checks
- settlements: settlement eligibility calculation and payout batch preparation
- sync: offline sync follow-up processing
- operations: route reconciliation, stale parcel checks, failed-delivery reminders
- risk: fraud signal checks and anomaly detection
- reports: scheduled report generation and exports

Each queue job must include a stable job id or idempotency key, retry policy, dead-letter handling, and structured job logs.

## Idempotency Design

Idempotency uses two layers:

1. PostgreSQL idempotency records for durable correctness.
2. Redis locks for short-lived concurrency control and fast duplicate suppression.

The idempotency record stores key, actor, endpoint or event type, request hash, response status, response body summary, expiry, and processing state. If a duplicate request uses the same key with a different request hash, the backend rejects it as an idempotency conflict.

Use idempotency on:

- parcel booking creation
- wallet ledger transactions
- payment callbacks
- custody scans
- manifest scan/departure/arrival events
- OTP pickup completion
- offline sync batches and events
- notification enqueueing
- settlement calculations and payout batch creation

## Monitoring and Observability Design

The backend must expose monitoring from day one.

Required monitoring surfaces:

- `GET /health/live` for process liveness
- `GET /health/ready` for database, Redis, and queue readiness
- `GET /health/version` for build metadata
- protected admin monitoring endpoints for queue summaries and failed jobs
- metrics output for request counts, latency, error counts, queue counts, and domain counters

Required structured log fields:

- request id
- actor id and role where available
- endpoint and method
- parcel id or waybill when relevant
- manifest id when relevant
- idempotency key when present
- queue name and job id for workers
- latency, status code, and error code

Important alert candidates:

- high API error rate
- database unavailable
- Redis unavailable
- queue backlog growing beyond threshold
- repeated failed jobs
- payment callback failures
- notification provider failure spike
- custody-event rejection spike
- offline sync conflict spike
- suspicious scan or route mismatch spike

## Security and Compliance

Use least-privilege role permissions. Store passwords with strong hashing. Store sensitive integration secrets in environment variables. Keep audit logs for operationally sensitive actions. Protect public tracking from enumeration by using non-sequential tracking codes. Apply input validation to all DTOs.

KYC and compliance documents should be referenced through metadata and storage keys, not stored directly in relational rows as large binary data.

## Testing Strategy

Use test-first implementation for domain behavior. Unit tests should cover pricing, custody transition rules, manifest validation, OTP validation, wallet ledger rules, settlement eligibility, and risk flags.

Integration tests should cover key API flows:

- create booking and issue waybill
- receive parcel at hub
- scan parcel into manifest
- depart and arrive manifest
- complete OTP pickup
- create failed delivery and return-to-hub
- charge wallet and record ledger entries
- calculate settlement eligibility
- sync offline events with duplicate idempotency keys
- process retryable BullMQ jobs idempotently
- expose health checks for database and Redis readiness

## Build Phases

1. Scaffold NestJS, Prisma, PostgreSQL, Redis, BullMQ config, health checks, validation, and API docs.
2. Build identity, roles, permissions, and staff/customer auth.
3. Build geography, hubs, service areas, routes, and partner compliance foundations.
4. Build parcel booking, pricing, waybill generation, and tracking.
5. Build custody ledger, scans, handovers, manifests, and route validation.
6. Build delivery completion, OTP pickup, proof of delivery, failed delivery, and returns.
7. Build wallets, payments, credit, invoices, settlements, payout holds, and reconciliation.
8. Build notifications, BullMQ workers, offline sync, exceptions, claims, fraud controls, monitoring, and admin control tower.
9. Add seed data, OpenAPI docs, broad tests, and verification scripts.

## Acceptance Criteria

The backend is complete when it can operate the full asset-light delivery model end to end:

- users and staff can be authenticated and authorized by role
- hubs, partners, vans, drivers, and service areas can be configured
- senders and merchants can create priced parcel bookings
- parcels receive waybills and tracking codes
- every parcel movement is backed by custody events
- manifests control grouped movement across hubs and routes
- delivery completion supports OTP pickup and proof of delivery
- failed delivery and return flows are traceable
- wallets, payments, credit, invoices, settlement, and payout holds are represented
- notification hooks exist for customer and operational events
- offline scan sync is idempotent and replay-safe
- Redis and BullMQ support retryable asynchronous jobs
- health, metrics, queue monitoring, and structured logs expose backend state
- exceptions and risk flags can be reviewed by admins
- public tracking exposes a safe parcel timeline
- admin control tower APIs support operations, finance, support, and risk workflows
