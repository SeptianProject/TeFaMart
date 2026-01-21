/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Tefa` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Tefa" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Product_isAvailable_name_idx" ON "Product"("isAvailable", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Tefa_slug_key" ON "Tefa"("slug");

-- CreateIndex
CREATE INDEX "Tefa_name_idx" ON "Tefa"("name");

-- CreateIndex
CREATE INDEX "Tefa_slug_idx" ON "Tefa"("slug");
