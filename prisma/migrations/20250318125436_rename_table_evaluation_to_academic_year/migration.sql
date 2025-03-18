/*
  Warnings:

  - You are about to drop the column `evaluationId` on the `EvaluationStatus` table. All the data in the column will be lost.
  - You are about to drop the column `evaluationId` on the `Peer` table. All the data in the column will be lost.
  - You are about to drop the column `evaluationId` on the `TeamLeadEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `evaluationId` on the `TeamLeadEvaluationResult` table. All the data in the column will be lost.
  - You are about to drop the `Evaluation` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[academicYearId,questionId,teamLeadEvaluationId,employeesId,templateDetailId]` on the table `TeamLeadEvaluationResult` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `academicYearId` to the `EvaluationStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicYearId` to the `Peer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicYearId` to the `TeamLeadEvaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicYearId` to the `TeamLeadEvaluationResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_peerTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_teamLeadTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "EvaluationStatus" DROP CONSTRAINT "EvaluationStatus_evaluationId_fkey";

-- DropForeignKey
ALTER TABLE "Peer" DROP CONSTRAINT "Peer_evaluationId_fkey";

-- DropForeignKey
ALTER TABLE "TeamLeadEvaluation" DROP CONSTRAINT "TeamLeadEvaluation_evaluationId_fkey";

-- DropForeignKey
ALTER TABLE "TeamLeadEvaluationResult" DROP CONSTRAINT "TeamLeadEvaluationResult_evaluationId_fkey";

-- DropIndex
DROP INDEX "TeamLeadEvaluationResult_evaluationId_questionId_teamLeadEv_key";

-- AlterTable
ALTER TABLE "EvaluationStatus" DROP COLUMN "evaluationId",
ADD COLUMN     "academicYearId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Peer" DROP COLUMN "evaluationId",
ADD COLUMN     "academicYearId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TeamLeadEvaluation" DROP COLUMN "evaluationId",
ADD COLUMN     "academicYearId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TeamLeadEvaluationResult" DROP COLUMN "evaluationId",
ADD COLUMN     "academicYearId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Evaluation";

-- CreateTable
CREATE TABLE "AcademicYear" (
    "id" SERIAL NOT NULL,
    "school_year" VARCHAR(100) NOT NULL,
    "semester" INTEGER NOT NULL,
    "status" "ModeStatus" NOT NULL DEFAULT 'NOT_SET',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "peerTemplateId" INTEGER,
    "teamLeadTemplateId" INTEGER,

    CONSTRAINT "AcademicYear_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AcademicYear_school_year_semester_key" ON "AcademicYear"("school_year", "semester");

-- CreateIndex
CREATE UNIQUE INDEX "TeamLeadEvaluationResult_academicYearId_questionId_teamLead_key" ON "TeamLeadEvaluationResult"("academicYearId", "questionId", "teamLeadEvaluationId", "employeesId", "templateDetailId");

-- AddForeignKey
ALTER TABLE "AcademicYear" ADD CONSTRAINT "AcademicYear_peerTemplateId_fkey" FOREIGN KEY ("peerTemplateId") REFERENCES "TemplateHeader"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicYear" ADD CONSTRAINT "AcademicYear_teamLeadTemplateId_fkey" FOREIGN KEY ("teamLeadTemplateId") REFERENCES "TemplateHeader"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peer" ADD CONSTRAINT "Peer_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationStatus" ADD CONSTRAINT "EvaluationStatus_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamLeadEvaluation" ADD CONSTRAINT "TeamLeadEvaluation_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamLeadEvaluationResult" ADD CONSTRAINT "TeamLeadEvaluationResult_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
