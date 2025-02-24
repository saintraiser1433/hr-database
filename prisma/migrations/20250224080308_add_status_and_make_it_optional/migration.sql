-- AlterTable
ALTER TABLE "Departments" ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Requirements" ADD COLUMN     "status" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "Screening" ALTER COLUMN "status" DROP NOT NULL;
