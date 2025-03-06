-- CreateEnum
CREATE TYPE "RequirementStatus" AS ENUM ('PENDING', 'EXPIRY', 'SUBMITTED');

-- CreateTable
CREATE TABLE "EmployeeRequirements" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "requirementsId" INTEGER NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "status" "RequirementStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "EmployeeRequirements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EmployeeRequirements" ADD CONSTRAINT "EmployeeRequirements_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeRequirements" ADD CONSTRAINT "EmployeeRequirements_requirementsId_fkey" FOREIGN KEY ("requirementsId") REFERENCES "Requirements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
