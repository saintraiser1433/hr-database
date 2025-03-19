/*
  Warnings:

  - Added the required column `departmentsId` to the `Evaluation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "departmentsId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_departmentsId_fkey" FOREIGN KEY ("departmentsId") REFERENCES "Departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
