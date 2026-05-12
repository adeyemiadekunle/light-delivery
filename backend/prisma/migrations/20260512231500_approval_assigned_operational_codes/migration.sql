CREATE TYPE "BusinessStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED');

ALTER TABLE "Merchant"
  ADD COLUMN "status" "BusinessStatus" NOT NULL DEFAULT 'PENDING',
  ALTER COLUMN "code" DROP NOT NULL,
  ALTER COLUMN "isActive" SET DEFAULT false;

UPDATE "Merchant"
SET "status" = 'ACTIVE'
WHERE "code" IS NOT NULL;

ALTER TABLE "PartnerShop"
  ALTER COLUMN "code" DROP NOT NULL;

ALTER TABLE "Driver"
  ADD COLUMN "code" TEXT;

CREATE UNIQUE INDEX "Driver_code_key" ON "Driver"("code");
