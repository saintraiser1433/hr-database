/*
  Warnings:

  - The `status` column on the `Evaluation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamLeadEvaluationHeader` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ModeStatus" AS ENUM ('NOT_SET', 'ONGOING', 'FINISHED');

-- CreateEnum
CREATE TYPE "EvaluatePerson" AS ENUM ('TeamLead', 'Employee');

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_commenterId_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_employeesId_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_evaluationId_fkey";

-- DropForeignKey
ALTER TABLE "TeamLeadEvaluationHeader" DROP CONSTRAINT "TeamLeadEvaluationHeader_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "TeamLeadEvaluationHeader" DROP CONSTRAINT "TeamLeadEvaluationHeader_teamLeadEvaluationId_fkey";

-- AlterTable
ALTER TABLE "Evaluation" DROP COLUMN "status",
ADD COLUMN     "status" "ModeStatus" NOT NULL DEFAULT 'NOT_SET';

-- DropTable
DROP TABLE "Comments";

-- DropTable
DROP TABLE "TeamLeadEvaluationHeader";

-- DropEnum
DROP TYPE "CommentType";

-- DropEnum
DROP TYPE "EvaluationStatus";

-- CreateTable
CREATE TABLE "EvaluationStatus" (
    "id" SERIAL NOT NULL,
    "evaluationId" INTEGER NOT NULL,
    "employeesId" INTEGER NOT NULL,
    "type" "EvaluatePerson" NOT NULL,
    "commenterId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvaluationStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EvaluationStatus" ADD CONSTRAINT "EvaluationStatus_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationStatus" ADD CONSTRAINT "EvaluationStatus_employeesId_fkey" FOREIGN KEY ("employeesId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationStatus" ADD CONSTRAINT "EvaluationStatus_commenterId_fkey" FOREIGN KEY ("commenterId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
