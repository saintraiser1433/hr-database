/*
  Warnings:

  - A unique constraint covering the columns `[job_id,screening_id]` on the table `JobScreening` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JobScreening_job_id_screening_id_key" ON "JobScreening"("job_id", "screening_id");
