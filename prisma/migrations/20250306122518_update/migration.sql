/*
  Warnings:

  - You are about to drop the column `status` on the `EmployeeRequirements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmployeeRequirements" DROP COLUMN "status";

-- DropEnum
DROP TYPE "RequirementStatus";
