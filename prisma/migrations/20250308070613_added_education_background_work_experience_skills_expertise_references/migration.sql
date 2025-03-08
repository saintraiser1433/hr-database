/*
  Warnings:

  - You are about to drop the column `age` on the `ApplicantInformation` table. All the data in the column will be lost.
  - You are about to drop the column `city_address` on the `ApplicantInformation` table. All the data in the column will be lost.
  - You are about to drop the column `college` on the `ApplicantInformation` table. All the data in the column will be lost.
  - You are about to drop the column `college_years_attended` on the `ApplicantInformation` table. All the data in the column will be lost.
  - You are about to drop the column `elementary` on the `ApplicantInformation` table. All the data in the column will be lost.
  - You are about to drop the column `elementary_years_attended` on the `ApplicantInformation` table. All the data in the column will be lost.
  - You are about to drop the column `highschool` on the `ApplicantInformation` table. All the data in the column will be lost.
  - You are about to drop the column `highschool_years_attended` on the `ApplicantInformation` table. All the data in the column will be lost.
  - You are about to drop the column `provincial_address` on the `ApplicantInformation` table. All the data in the column will be lost.
  - The `date_of_birth` column on the `ApplicantInformation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ApplicantInformation" DROP COLUMN "age",
DROP COLUMN "city_address",
DROP COLUMN "college",
DROP COLUMN "college_years_attended",
DROP COLUMN "elementary",
DROP COLUMN "elementary_years_attended",
DROP COLUMN "highschool",
DROP COLUMN "highschool_years_attended",
DROP COLUMN "provincial_address",
ADD COLUMN     "current_address" TEXT,
ADD COLUMN     "language_spoken" TEXT,
ADD COLUMN     "nickname" VARCHAR(100),
ADD COLUMN     "parents_current_address" TEXT,
ADD COLUMN     "permanent_address" TEXT,
DROP COLUMN "date_of_birth",
ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ALTER COLUMN "telephone_number" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "EducationBackground" (
    "id" SERIAL NOT NULL,
    "school_name" TEXT,
    "degree" TEXT,
    "year_started" TEXT,
    "year_ended" TEXT,
    "description" TEXT,
    "applicantInformationId" INTEGER,

    CONSTRAINT "EducationBackground_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkExperience" (
    "id" SERIAL NOT NULL,
    "company_name" TEXT,
    "job_title" TEXT,
    "work_year_started" TEXT,
    "work_year_ended" TEXT,
    "applicantInformationId" INTEGER,

    CONSTRAINT "WorkExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillsExpertise" (
    "id" SERIAL NOT NULL,
    "skills_name" TEXT,
    "applicantInformationId" INTEGER,

    CONSTRAINT "SkillsExpertise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "References" (
    "id" SERIAL NOT NULL,
    "name_of_person" TEXT,
    "position" TEXT,
    "ref_contact_number" TEXT,
    "applicantInformationId" INTEGER,

    CONSTRAINT "References_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EducationBackground" ADD CONSTRAINT "EducationBackground_applicantInformationId_fkey" FOREIGN KEY ("applicantInformationId") REFERENCES "ApplicantInformation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_applicantInformationId_fkey" FOREIGN KEY ("applicantInformationId") REFERENCES "ApplicantInformation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillsExpertise" ADD CONSTRAINT "SkillsExpertise_applicantInformationId_fkey" FOREIGN KEY ("applicantInformationId") REFERENCES "ApplicantInformation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "References" ADD CONSTRAINT "References_applicantInformationId_fkey" FOREIGN KEY ("applicantInformationId") REFERENCES "ApplicantInformation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
