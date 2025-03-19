/*
  Warnings:

  - You are about to drop the column `departmentsId` on the `Evaluation` table. All the data in the column will be lost.
  - Added the required column `departmentId` to the `Evaluation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_departmentsId_fkey";

-- AlterTable
ALTER TABLE "Evaluation" DROP COLUMN "departmentsId",
ADD COLUMN     "departmentId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
