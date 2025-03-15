/*
  Warnings:

  - A unique constraint covering the columns `[evaluationId,questionId,teamLeadEvaluationId,employeesId,templateDetailId]` on the table `TeamLeadEvaluationResult` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `commentType` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commenterId` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeesId` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluationId` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CommentType" AS ENUM ('TeamLead', 'Employee');

-- DropIndex
DROP INDEX "TeamLeadEvaluationResult_evaluationId_questionId_employeesI_key";

-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "commentType" "CommentType" NOT NULL,
ADD COLUMN     "commenterId" INTEGER NOT NULL,
ADD COLUMN     "employeesId" INTEGER NOT NULL,
ADD COLUMN     "evaluationId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TeamLeadEvaluationResult_evaluationId_questionId_teamLeadEv_key" ON "TeamLeadEvaluationResult"("evaluationId", "questionId", "teamLeadEvaluationId", "employeesId", "templateDetailId");

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_employeesId_fkey" FOREIGN KEY ("employeesId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_commenterId_fkey" FOREIGN KEY ("commenterId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
