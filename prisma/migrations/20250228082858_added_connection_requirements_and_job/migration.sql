-- AlterTable
ALTER TABLE "Requirements" ADD COLUMN     "jobId" INTEGER;

-- AddForeignKey
ALTER TABLE "Requirements" ADD CONSTRAINT "Requirements_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
