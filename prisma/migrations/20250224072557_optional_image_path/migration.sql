-- AlterTable
ALTER TABLE "Departments" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "imagePath" DROP NOT NULL;
