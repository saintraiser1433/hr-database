/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Requirements` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Requirements_title_key" ON "Requirements"("title");
