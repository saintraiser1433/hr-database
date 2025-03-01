/*
  Warnings:

  - You are about to drop the column `requirementsId` on the `Job` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_requirementsId_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "requirementsId";

-- AlterTable
ALTER TABLE "Requirements" ADD COLUMN     "jobId" INTEGER;

-- AddForeignKey
ALTER TABLE "Requirements" ADD CONSTRAINT "Requirements_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
