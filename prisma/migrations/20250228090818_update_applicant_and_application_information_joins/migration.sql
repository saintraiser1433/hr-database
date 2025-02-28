/*
  Warnings:

  - You are about to drop the column `applicantsInformationId` on the `Applicant` table. All the data in the column will be lost.
  - Added the required column `applicantId` to the `ApplicantInformation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Applicant" DROP CONSTRAINT "Applicant_applicantsInformationId_fkey";

-- AlterTable
ALTER TABLE "Applicant" DROP COLUMN "applicantsInformationId";

-- AlterTable
ALTER TABLE "ApplicantInformation" ADD COLUMN     "applicantId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ApplicantInformation" ADD CONSTRAINT "ApplicantInformation_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
