/*
  Warnings:

  - You are about to drop the column `jobId` on the `Requirements` table. All the data in the column will be lost.
  - Added the required column `requirementsId` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "JobScreening" DROP CONSTRAINT "JobScreening_job_id_fkey";

-- DropForeignKey
ALTER TABLE "Requirements" DROP CONSTRAINT "Requirements_jobId_fkey";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "requirementsId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Requirements" DROP COLUMN "jobId";

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_requirementsId_fkey" FOREIGN KEY ("requirementsId") REFERENCES "Requirements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobScreening" ADD CONSTRAINT "JobScreening_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
