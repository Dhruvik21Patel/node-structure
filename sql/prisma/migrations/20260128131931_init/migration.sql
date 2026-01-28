/*
  Warnings:

  - A unique constraint covering the columns `[name,user_id]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "categories_name_key";

-- CreateIndex
CREATE INDEX "categories_user_id_idx" ON "categories"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_user_id_key" ON "categories"("name", "user_id");

-- CreateIndex
CREATE INDEX "products_user_id_idx" ON "products"("user_id");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "products"("category_id");
