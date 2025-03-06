/*
  Warnings:

  - Added the required column `status` to the `EmployeeRequirements` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequirementStatus" AS ENUM ('PENDING', 'SUBMITTED', 'EXPIRED');

-- AlterTable
ALTER TABLE "EmployeeRequirements" ADD COLUMN     "status" "RequirementStatus" NOT NULL;
