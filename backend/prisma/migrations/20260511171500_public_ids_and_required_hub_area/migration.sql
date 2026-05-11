-- Add stable public identifiers for entities that appear in external URLs,
-- support workflows, and operational dashboards.
ALTER TABLE "Hub" ADD COLUMN "publicId" TEXT;
ALTER TABLE "PartnerShop" ADD COLUMN "publicId" TEXT;
ALTER TABLE "PartnerVehicle" ADD COLUMN "publicId" TEXT;
ALTER TABLE "Driver" ADD COLUMN "publicId" TEXT;

UPDATE "Hub"
SET "publicId" = 'HUB-' || upper(substring(md5("id"), 1, 12))
WHERE "publicId" IS NULL;

UPDATE "PartnerShop"
SET "publicId" = 'PSH-' || upper(substring(md5("id"), 1, 12))
WHERE "publicId" IS NULL;

UPDATE "PartnerVehicle"
SET "publicId" = 'VEH-' || upper(substring(md5("id"), 1, 12))
WHERE "publicId" IS NULL;

UPDATE "Driver"
SET "publicId" = 'DRV-' || upper(substring(md5("id"), 1, 12))
WHERE "publicId" IS NULL;

ALTER TABLE "Hub" ALTER COLUMN "publicId" SET NOT NULL;
ALTER TABLE "PartnerShop" ALTER COLUMN "publicId" SET NOT NULL;
ALTER TABLE "PartnerVehicle" ALTER COLUMN "publicId" SET NOT NULL;
ALTER TABLE "Driver" ALTER COLUMN "publicId" SET NOT NULL;

CREATE UNIQUE INDEX "Hub_publicId_key" ON "Hub"("publicId");
CREATE UNIQUE INDEX "PartnerShop_publicId_key" ON "PartnerShop"("publicId");
CREATE UNIQUE INDEX "PartnerVehicle_publicId_key" ON "PartnerVehicle"("publicId");
CREATE UNIQUE INDEX "Driver_publicId_key" ON "Driver"("publicId");

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "Hub" WHERE "localAreaId" IS NULL) THEN
    RAISE EXCEPTION 'Cannot require Hub.localAreaId while existing hubs have null localAreaId';
  END IF;
END $$;

ALTER TABLE "Hub" DROP CONSTRAINT "Hub_localAreaId_fkey";
ALTER TABLE "Hub" ALTER COLUMN "localAreaId" SET NOT NULL;
ALTER TABLE "Hub" ADD CONSTRAINT "Hub_localAreaId_fkey" FOREIGN KEY ("localAreaId") REFERENCES "LocalArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
