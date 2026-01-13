/*
  Warnings:

  - You are about to drop the column `description` on the `Campus` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Campus` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `clientEmail` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `clientName` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Request` table. All the data in the column will be lost.
  - The `status` column on the `Request` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Campus" DROP COLUMN "description",
DROP COLUMN "location",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "province" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "image",
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "clientEmail",
DROP COLUMN "clientName",
DROP COLUMN "type",
ADD COLUMN     "requestedBy" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'CLIENT';

-- DropEnum
DROP TYPE "RequestStatus";

-- DropEnum
DROP TYPE "RequestType";

-- DropEnum
DROP TYPE "Role";

-- CreateIndex
CREATE INDEX "Product_tefaId_idx" ON "Product"("tefaId");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "Product"("name");

-- CreateIndex
CREATE INDEX "Request_productId_idx" ON "Request"("productId");

-- CreateIndex
CREATE INDEX "Request_status_idx" ON "Request"("status");

-- CreateIndex
CREATE INDEX "Tefa_campusId_idx" ON "Tefa"("campusId");

-- CreateIndex
CREATE INDEX "Tefa_major_idx" ON "Tefa"("major");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_campusId_idx" ON "User"("campusId");
