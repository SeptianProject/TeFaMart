/*
  Warnings:

  - Added the required column `clientEmail` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientName` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "clientEmail" TEXT NOT NULL,
ADD COLUMN     "clientName" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'PURCHASE_ORDER',
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "Request_userId_idx" ON "Request"("userId");
