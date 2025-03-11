/*
  Warnings:

  - You are about to alter the column `percentage` on the `TeamLeadEvaluation` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "TeamLeadEvaluation" ALTER COLUMN "percentage" SET DATA TYPE DECIMAL(10,2);
