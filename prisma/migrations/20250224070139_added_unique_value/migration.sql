/*
  Warnings:

  - You are about to drop the column `status` on the `Departments` table. All the data in the column will be lost.
  - The primary key for the `JobScreening` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[title]` on the table `Departments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[job_id,screening_id]` on the table `JobScreening` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Departments" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "status" SET DEFAULT true;

-- AlterTable
ALTER TABLE "JobScreening" DROP CONSTRAINT "JobScreening_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "Departments_title_key" ON "Departments"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Job_title_key" ON "Job"("title");

-- CreateIndex
CREATE UNIQUE INDEX "JobScreening_job_id_screening_id_key" ON "JobScreening"("job_id", "screening_id");
