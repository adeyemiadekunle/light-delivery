CREATE TABLE "MerchantUser" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MerchantUser_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HubStaff" (
    "id" TEXT NOT NULL,
    "hubId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'staff',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HubStaff_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DriverAssignment" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'driver',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriverAssignment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MerchantUser_merchantId_userId_key" ON "MerchantUser"("merchantId", "userId");
CREATE INDEX "MerchantUser_userId_isActive_idx" ON "MerchantUser"("userId", "isActive");

CREATE UNIQUE INDEX "HubStaff_hubId_userId_key" ON "HubStaff"("hubId", "userId");
CREATE INDEX "HubStaff_userId_isActive_idx" ON "HubStaff"("userId", "isActive");

CREATE UNIQUE INDEX "DriverAssignment_driverId_userId_key" ON "DriverAssignment"("driverId", "userId");
CREATE INDEX "DriverAssignment_userId_isActive_idx" ON "DriverAssignment"("userId", "isActive");

ALTER TABLE "MerchantUser" ADD CONSTRAINT "MerchantUser_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MerchantUser" ADD CONSTRAINT "MerchantUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "HubStaff" ADD CONSTRAINT "HubStaff_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "Hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "HubStaff" ADD CONSTRAINT "HubStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Driver" ADD CONSTRAINT "Driver_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DriverAssignment" ADD CONSTRAINT "DriverAssignment_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DriverAssignment" ADD CONSTRAINT "DriverAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
