/*
  Warnings:

  - You are about to drop the column `employeesId` on the `PeerEvaluationResult` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[academicYearId,questionId,peerCategoryId,templateDetailId,peerEvaluationId]` on the table `PeerEvaluationResult` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PeerEvaluationResult" DROP CONSTRAINT "PeerEvaluationResult_employeesId_fkey";

-- DropIndex
DROP INDEX "PeerEvaluationResult_academicYearId_questionId_peerCategory_key";

-- AlterTable
ALTER TABLE "PeerEvaluationResult" DROP COLUMN "employeesId";

-- CreateIndex
CREATE UNIQUE INDEX "PeerEvaluationResult_academicYearId_questionId_peerCategory_key" ON "PeerEvaluationResult"("academicYearId", "questionId", "peerCategoryId", "templateDetailId", "peerEvaluationId");
