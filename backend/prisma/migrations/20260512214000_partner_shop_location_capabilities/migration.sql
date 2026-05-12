ALTER TABLE "PartnerShop"
  ADD COLUMN "supportsDropoff" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "supportsPickup" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "supportsReturns" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "supportsPrintInShop" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "supportsDigitalReceipt" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "openingHours" JSONB;
