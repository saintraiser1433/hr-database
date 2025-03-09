/*
  Warnings:

  - You are about to drop the column `sequence_number` on the `TemplateDetail` table. All the data in the column will be lost.
  - Added the required column `score` to the `TemplateDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TemplateDetail" DROP COLUMN "sequence_number",
ADD COLUMN     "score" INTEGER NOT NULL;
