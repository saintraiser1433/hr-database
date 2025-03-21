/*
  Warnings:

  - You are about to drop the column `commenterId` on the `EvaluationStatus` table. All the data in the column will be lost.
  - You are about to drop the column `employeesId` on the `EvaluationStatus` table. All the data in the column will be lost.
  - You are about to drop the column `employeesId` on the `TeamLeadEvaluationResult` table. All the data in the column will be lost.
  - Added the required column `evaluateeId` to the `EvaluationStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluatorId` to the `EvaluationStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluationStatusId` to the `TeamLeadEvaluationResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EvaluationStatus" DROP CONSTRAINT "EvaluationStatus_commenterId_fkey";

-- DropForeignKey
ALTER TABLE "EvaluationStatus" DROP CONSTRAINT "EvaluationStatus_employeesId_fkey";

-- DropForeignKey
ALTER TABLE "TeamLeadEvaluationResult" DROP CONSTRAINT "TeamLeadEvaluationResult_employeesId_fkey";

-- DropIndex
DROP INDEX "TeamLeadEvaluationResult_academicYearId_questionId_teamLead_key";

-- AlterTable
ALTER TABLE "EvaluationStatus" DROP COLUMN "commenterId",
DROP COLUMN "employeesId",
ADD COLUMN     "evaluateeId" INTEGER NOT NULL,
ADD COLUMN     "evaluatorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TeamLeadEvaluationResult" DROP COLUMN "employeesId",
ADD COLUMN     "evaluationStatusId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "EvaluationStatus" ADD CONSTRAINT "EvaluationStatus_evaluateeId_fkey" FOREIGN KEY ("evaluateeId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationStatus" ADD CONSTRAINT "EvaluationStatus_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamLeadEvaluationResult" ADD CONSTRAINT "TeamLeadEvaluationResult_evaluationStatusId_fkey" FOREIGN KEY ("evaluationStatusId") REFERENCES "EvaluationStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
