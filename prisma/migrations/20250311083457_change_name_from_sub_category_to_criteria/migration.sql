/*
  Warnings:

  - You are about to drop the column `teamLeadSubcategoryId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the `TeamLeadSubcategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_teamLeadSubcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "TeamLeadSubcategory" DROP CONSTRAINT "TeamLeadSubcategory_teamLeadEvaluationId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "teamLeadSubcategoryId",
ADD COLUMN     "teamLeadCriteriaId" INTEGER;

-- DropTable
DROP TABLE "TeamLeadSubcategory";

-- CreateTable
CREATE TABLE "TeamLeadCriteria" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "teamLeadEvaluationId" INTEGER NOT NULL,

    CONSTRAINT "TeamLeadCriteria_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeamLeadCriteria" ADD CONSTRAINT "TeamLeadCriteria_teamLeadEvaluationId_fkey" FOREIGN KEY ("teamLeadEvaluationId") REFERENCES "TeamLeadEvaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_teamLeadCriteriaId_fkey" FOREIGN KEY ("teamLeadCriteriaId") REFERENCES "TeamLeadCriteria"("id") ON DELETE SET NULL ON UPDATE CASCADE;
