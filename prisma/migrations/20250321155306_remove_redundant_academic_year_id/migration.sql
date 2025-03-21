/*
  Warnings:

  - You are about to drop the column `academicYearId` on the `PeerEvaluationResult` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PeerEvaluationResult" DROP CONSTRAINT "PeerEvaluationResult_academicYearId_fkey";

-- DropForeignKey
ALTER TABLE "TeamLeadEvaluationResult" DROP CONSTRAINT "TeamLeadEvaluationResult_academicYearId_fkey";

-- AlterTable
ALTER TABLE "PeerEvaluationResult" DROP COLUMN "academicYearId";

-- AlterTable
ALTER TABLE "TeamLeadEvaluationResult" ALTER COLUMN "academicYearId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TeamLeadEvaluationResult" ADD CONSTRAINT "TeamLeadEvaluationResult_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE SET NULL ON UPDATE CASCADE;
