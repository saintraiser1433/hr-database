/*
  Warnings:

  - A unique constraint covering the columns `[academicYearId,questionId,peerCategoryId,templateDetailId]` on the table `PeerEvaluationResult` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PeerEvaluationResult_academicYearId_questionId_peerCategory_key";

-- CreateIndex
CREATE UNIQUE INDEX "PeerEvaluationResult_academicYearId_questionId_peerCategory_key" ON "PeerEvaluationResult"("academicYearId", "questionId", "peerCategoryId", "templateDetailId");
