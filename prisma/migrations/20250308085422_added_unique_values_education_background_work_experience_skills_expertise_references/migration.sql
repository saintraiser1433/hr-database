/*
  Warnings:

  - A unique constraint covering the columns `[applicantInformationId,school_name]` on the table `EducationBackground` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[applicantInformationId,name_of_person]` on the table `References` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[applicantInformationId,skills_name]` on the table `SkillsExpertise` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[applicantInformationId,company_name]` on the table `WorkExperience` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EducationBackground_applicantInformationId_school_name_key" ON "EducationBackground"("applicantInformationId", "school_name");

-- CreateIndex
CREATE UNIQUE INDEX "References_applicantInformationId_name_of_person_key" ON "References"("applicantInformationId", "name_of_person");

-- CreateIndex
CREATE UNIQUE INDEX "SkillsExpertise_applicantInformationId_skills_name_key" ON "SkillsExpertise"("applicantInformationId", "skills_name");

-- CreateIndex
CREATE UNIQUE INDEX "WorkExperience_applicantInformationId_company_name_key" ON "WorkExperience"("applicantInformationId", "company_name");
