-- AlterEnum
ALTER TYPE "ApplicationStatus" ADD VALUE 'FAILED';

-- AlterTable
ALTER TABLE "ApplicantScreening" ADD COLUMN     "dateInterview" TIMESTAMP(3);
