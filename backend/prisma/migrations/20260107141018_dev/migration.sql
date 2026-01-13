/*
  Warnings:

  - You are about to drop the column `stockQuantity` on the `Product` table. All the data in the column will be lost.
  - The `variantTypes` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "stockQuantity",
DROP COLUMN "variantTypes",
ADD COLUMN     "variantTypes" TEXT[];

-- DropEnum
DROP TYPE "public"."Variants";
