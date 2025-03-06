/*
  Warnings:

  - You are about to drop the column `employeeRequirementsId` on the `Requirements` table. All the data in the column will be lost.
  - Added the required column `requirementsId` to the `EmployeeRequirements` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Requirements" DROP CONSTRAINT "Requirements_employeeRequirementsId_fkey";

-- AlterTable
ALTER TABLE "EmployeeRequirements" ADD COLUMN     "requirementsId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Requirements" DROP COLUMN "employeeRequirementsId";

-- AddForeignKey
ALTER TABLE "EmployeeRequirements" ADD CONSTRAINT "EmployeeRequirements_requirementsId_fkey" FOREIGN KEY ("requirementsId") REFERENCES "Requirements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
