/*
  Warnings:

  - Made the column `status` on table `EmployeeRequirements` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "EmployeeRequirements" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
