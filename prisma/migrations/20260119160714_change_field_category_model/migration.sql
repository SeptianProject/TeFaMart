/*
  Warnings:

  - You are about to drop the column `color` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Category` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Category_isActive_idx";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "color",
DROP COLUMN "description",
DROP COLUMN "icon",
DROP COLUMN "isActive",
DROP COLUMN "order";
