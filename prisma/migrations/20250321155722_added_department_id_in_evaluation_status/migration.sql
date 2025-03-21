/*
  Warnings:

  - Added the required column `departmentsId` to the `EvaluationStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EvaluationStatus" ADD COLUMN     "departmentsId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "EvaluationStatus" ADD CONSTRAINT "EvaluationStatus_departmentsId_fkey" FOREIGN KEY ("departmentsId") REFERENCES "Departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
