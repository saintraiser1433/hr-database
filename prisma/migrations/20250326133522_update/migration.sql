-- AlterEnum
ALTER TYPE "RequirementStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "EmployeeRequirements" ALTER COLUMN "status" SET DEFAULT 'NOT_SUBMITTED';
