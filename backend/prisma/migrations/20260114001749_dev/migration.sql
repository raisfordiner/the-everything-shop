-- CreateEnum
CREATE TYPE "InventoryLogType" AS ENUM ('PRODUCT_CREATED', 'OUT_OF_STOCK');

-- CreateEnum
CREATE TYPE "RevenueLogType" AS ENUM ('ORDER_COMPLETED', 'RETURN_COMPLETED', 'CANCELLATION_COMPLETED');

-- CreateEnum
CREATE TYPE "AuditLogType" AS ENUM ('USER_SIGNUP', 'USER_LOGIN');

-- CreateTable
CREATE TABLE "InventoryLog" (
    "id" TEXT NOT NULL,
    "type" "InventoryLogType" NOT NULL,
    "productId" TEXT,
    "variantId" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenueLog" (
    "id" TEXT NOT NULL,
    "type" "RevenueLogType" NOT NULL,
    "orderId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RevenueLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "type" "AuditLogType" NOT NULL,
    "userId" TEXT,
    "email" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);
