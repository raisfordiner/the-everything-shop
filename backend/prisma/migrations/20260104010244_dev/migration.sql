-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('BRONZE', 'SILVER', 'GOLD');

-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'STRIPE';

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "membership" "MembershipStatus" NOT NULL DEFAULT 'BRONZE',
    "spent" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
