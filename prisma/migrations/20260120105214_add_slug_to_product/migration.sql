/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Add slug column with temporary default value
ALTER TABLE "Product" ADD COLUMN "slug" TEXT;

-- Update existing products with slug generated from name
UPDATE "Product" 
SET "slug" = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      CONCAT(
        REGEXP_REPLACE(name, '[^a-zA-Z0-9\s-]', '', 'g'),
        '-',
        SUBSTRING(id, 1, 8)
      ),
      '\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
);

-- Make slug NOT NULL after populating data
ALTER TABLE "Product" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "Product"("slug");
