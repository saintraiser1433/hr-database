/*
  Warnings:

  - The values [ADMIN,EMPLOYEE,TEAMLEAD] on the enum `RoleStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoleStatus_new" AS ENUM ('Admin', 'Employee', 'TeamLead');
ALTER TABLE "Employees" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Employees" ALTER COLUMN "role" TYPE "RoleStatus_new" USING ("role"::text::"RoleStatus_new");
ALTER TYPE "RoleStatus" RENAME TO "RoleStatus_old";
ALTER TYPE "RoleStatus_new" RENAME TO "RoleStatus";
DROP TYPE "RoleStatus_old";
ALTER TABLE "Employees" ALTER COLUMN "role" SET DEFAULT 'Employee';
COMMIT;

-- AlterTable
ALTER TABLE "Employees" ALTER COLUMN "role" SET DEFAULT 'Employee';
