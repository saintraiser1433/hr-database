/*
  Warnings:

  - You are about to drop the column `academicYearId` on the `TeamLeadEvaluationResult` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TeamLeadEvaluationResult" DROP CONSTRAINT "TeamLeadEvaluationResult_academicYearId_fkey";

-- AlterTable
ALTER TABLE "TeamLeadEvaluationResult" DROP COLUMN "academicYearId";
