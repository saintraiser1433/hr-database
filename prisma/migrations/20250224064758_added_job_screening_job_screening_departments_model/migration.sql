/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Requirements` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Requirements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Requirements" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "description" TEXT NOT NULL,
    "totalAvailable" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "imagePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Screening" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Screening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobScreening" (
    "job_id" INTEGER NOT NULL,
    "screening_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobScreening_pkey" PRIMARY KEY ("job_id","screening_id")
);

-- CreateTable
CREATE TABLE "Departments" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Departments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JobScreening" ADD CONSTRAINT "JobScreening_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobScreening" ADD CONSTRAINT "JobScreening_screening_id_fkey" FOREIGN KEY ("screening_id") REFERENCES "Screening"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
