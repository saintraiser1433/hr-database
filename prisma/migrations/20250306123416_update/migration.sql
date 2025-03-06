/*
  Warnings:

  - You are about to drop the column `requirementsId` on the `EmployeeRequirements` table. All the data in the column will be lost.
  - Added the required column `employeeRequirementsId` to the `Requirements` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EmployeeRequirements" DROP CONSTRAINT "EmployeeRequirements_requirementsId_fkey";

-- AlterTable
ALTER TABLE "EmployeeRequirements" DROP COLUMN "requirementsId";

-- AlterTable
ALTER TABLE "Requirements" ADD COLUMN     "employeeRequirementsId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Requirements" ADD CONSTRAINT "Requirements_employeeRequirementsId_fkey" FOREIGN KEY ("employeeRequirementsId") REFERENCES "EmployeeRequirements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
