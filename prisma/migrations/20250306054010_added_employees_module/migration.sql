-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "RoleStatus" AS ENUM ('ADMIN', 'USER', 'TEAMLEAD');

-- CreateTable
CREATE TABLE "Employees" (
    "id" SERIAL NOT NULL,
    "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE',
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "informationId" INTEGER NOT NULL,
    "jobId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "role" "RoleStatus" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employees_username_key" ON "Employees"("username");

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_informationId_fkey" FOREIGN KEY ("informationId") REFERENCES "ApplicantInformation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
