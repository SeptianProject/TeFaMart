/*
  Warnings:

  - You are about to drop the column `address` on the `Campus` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Campus` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `Campus` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Industry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Campus" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "province";

-- AlterTable
ALTER TABLE "Industry" DROP COLUMN "address";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "province" TEXT;
