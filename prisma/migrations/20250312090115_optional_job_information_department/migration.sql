-- DropForeignKey
ALTER TABLE "Employees" DROP CONSTRAINT "Employees_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Employees" DROP CONSTRAINT "Employees_informationId_fkey";

-- DropForeignKey
ALTER TABLE "Employees" DROP CONSTRAINT "Employees_jobId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_teamLeadCriteriaId_fkey";

-- AlterTable
ALTER TABLE "Employees" ALTER COLUMN "informationId" DROP NOT NULL,
ALTER COLUMN "jobId" DROP NOT NULL,
ALTER COLUMN "departmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_informationId_fkey" FOREIGN KEY ("informationId") REFERENCES "ApplicantInformation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_teamLeadCriteriaId_fkey" FOREIGN KEY ("teamLeadCriteriaId") REFERENCES "TeamLeadCriteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
