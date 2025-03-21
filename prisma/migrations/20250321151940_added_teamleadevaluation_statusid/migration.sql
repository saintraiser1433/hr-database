/*
  Warnings:

  - You are about to drop the column `evaluationStatusId` on the `TeamLeadEvaluationResult` table. All the data in the column will be lost.
  - Added the required column `teamLeadEvaluationStatusId` to the `TeamLeadEvaluationResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TeamLeadEvaluationResult" DROP CONSTRAINT "TeamLeadEvaluationResult_evaluationStatusId_fkey";

-- AlterTable
ALTER TABLE "TeamLeadEvaluationResult" DROP COLUMN "evaluationStatusId",
ADD COLUMN     "teamLeadEvaluationStatusId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "TeamLeadEvaluationResult" ADD CONSTRAINT "TeamLeadEvaluationResult_teamLeadEvaluationStatusId_fkey" FOREIGN KEY ("teamLeadEvaluationStatusId") REFERENCES "EvaluationStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
