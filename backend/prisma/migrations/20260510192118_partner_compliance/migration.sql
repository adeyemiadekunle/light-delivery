-- CreateEnum
CREATE TYPE "ComplianceDocumentType" AS ENUM ('BUSINESS_REGISTRATION', 'GOVERNMENT_ID', 'VEHICLE_INSURANCE', 'ROADWORTHINESS', 'VEHICLE_LICENSE', 'DRIVER_LICENSE', 'OTHER');

-- CreateEnum
CREATE TYPE "ComplianceDocumentStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "PartnerDocument" (
    "id" TEXT NOT NULL,
    "type" "ComplianceDocumentType" NOT NULL,
    "status" "ComplianceDocumentStatus" NOT NULL DEFAULT 'PENDING',
    "documentNumber" TEXT,
    "storageKey" TEXT,
    "fileName" TEXT,
    "issuedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "notes" TEXT,
    "partnerShopId" TEXT,
    "partnerVehicleId" TEXT,
    "driverId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PartnerVehicle" ADD CONSTRAINT "PartnerVehicle_partnerShopId_fkey" FOREIGN KEY ("partnerShopId") REFERENCES "PartnerShop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerDocument" ADD CONSTRAINT "PartnerDocument_partnerShopId_fkey" FOREIGN KEY ("partnerShopId") REFERENCES "PartnerShop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerDocument" ADD CONSTRAINT "PartnerDocument_partnerVehicleId_fkey" FOREIGN KEY ("partnerVehicleId") REFERENCES "PartnerVehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerDocument" ADD CONSTRAINT "PartnerDocument_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
