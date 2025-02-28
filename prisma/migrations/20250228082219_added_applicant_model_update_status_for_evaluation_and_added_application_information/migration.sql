/*
  Warnings:

  - The `status` column on the `Evaluation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ONGOING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('NOT_SET', 'ONGOING', 'FINISHED');

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_evaluationId_fkey";

-- AlterTable
ALTER TABLE "Evaluation" DROP COLUMN "status",
ADD COLUMN     "status" "EvaluationStatus" NOT NULL DEFAULT 'NOT_SET';

-- CreateTable
CREATE TABLE "Applicant" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "applicantsInformationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicantInformation" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "middle_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "contact_number" INTEGER NOT NULL,
    "resume_path" TEXT NOT NULL,
    "gender" VARCHAR(100),
    "age" INTEGER,
    "civil_status" VARCHAR(100),
    "date_of_birth" VARCHAR(100),
    "city_address" TEXT,
    "provincial_address" TEXT,
    "telephone_number" INTEGER,
    "religion" TEXT,
    "citizenship" TEXT,
    "fathers_name" TEXT,
    "fathers_occupation" TEXT,
    "mothers_name" TEXT,
    "mothers_occupation" TEXT,
    "parents_address" TEXT,
    "person_to_be_contact" TEXT,
    "elementary" TEXT,
    "elementary_years_attended" TEXT,
    "highschool" TEXT,
    "highschool_years_attended" TEXT,
    "college" TEXT,
    "college_years_attended" TEXT,

    CONSTRAINT "ApplicantInformation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_applicantsInformationId_fkey" FOREIGN KEY ("applicantsInformationId") REFERENCES "ApplicantInformation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
