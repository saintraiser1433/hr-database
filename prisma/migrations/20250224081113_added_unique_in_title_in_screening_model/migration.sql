/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Screening` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Screening_title_key" ON "Screening"("title");
