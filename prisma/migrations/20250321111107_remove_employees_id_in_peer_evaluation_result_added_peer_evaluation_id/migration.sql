/*
  Warnings:

  - A unique constraint covering the columns `[academicYearId,questionId,peerCategoryId,employeesId,templateDetailId,peerEvaluationId]` on the table `PeerEvaluationResult` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `peerEvaluationId` to the `PeerEvaluationResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PeerEvaluationResult_academicYearId_questionId_peerCategory_key";

-- AlterTable
ALTER TABLE "PeerEvaluationResult" ADD COLUMN     "peerEvaluationId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PeerEvaluationResult_academicYearId_questionId_peerCategory_key" ON "PeerEvaluationResult"("academicYearId", "questionId", "peerCategoryId", "employeesId", "templateDetailId", "peerEvaluationId");

-- AddForeignKey
ALTER TABLE "PeerEvaluationResult" ADD CONSTRAINT "PeerEvaluationResult_peerEvaluationId_fkey" FOREIGN KEY ("peerEvaluationId") REFERENCES "PeerEvaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
