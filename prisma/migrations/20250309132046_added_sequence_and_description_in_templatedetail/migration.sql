/*
  Warnings:

  - Added the required column `description` to the `TemplateDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sequence_number` to the `TemplateDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TemplateDetail" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "sequence_number" INTEGER NOT NULL;
