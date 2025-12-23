/*
  Warnings:

  - You are about to drop the column `customerId` on the `CartItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."CartItem" DROP CONSTRAINT "CartItem_customerId_fkey";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "customerId";
