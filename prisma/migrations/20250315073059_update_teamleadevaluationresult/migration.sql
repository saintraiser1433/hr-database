/*
  Warnings:

  - The primary key for the `TeamLeadEvaluationResult` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[evaluationId,questionId,employeesId,templateDetailId,teamLeadEvaluationId]` on the table `TeamLeadEvaluationResult` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teamLeadEvaluationId` to the `TeamLeadEvaluationHeader` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamLeadEvaluationId` to the `TeamLeadEvaluationResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TeamLeadEvaluationHeader" ADD COLUMN     "teamLeadEvaluationId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TeamLeadEvaluationResult" DROP CONSTRAINT "TeamLeadEvaluationResult_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "teamLeadEvaluationId" INTEGER NOT NULL,
ADD CONSTRAINT "TeamLeadEvaluationResult_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "TeamLeadEvaluationResult_evaluationId_questionId_employeesI_key" ON "TeamLeadEvaluationResult"("evaluationId", "questionId", "employeesId", "templateDetailId", "teamLeadEvaluationId");

-- AddForeignKey
ALTER TABLE "TeamLeadEvaluationHeader" ADD CONSTRAINT "TeamLeadEvaluationHeader_teamLeadEvaluationId_fkey" FOREIGN KEY ("teamLeadEvaluationId") REFERENCES "TeamLeadEvaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamLeadEvaluationResult" ADD CONSTRAINT "TeamLeadEvaluationResult_teamLeadEvaluationId_fkey" FOREIGN KEY ("teamLeadEvaluationId") REFERENCES "TeamLeadEvaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
