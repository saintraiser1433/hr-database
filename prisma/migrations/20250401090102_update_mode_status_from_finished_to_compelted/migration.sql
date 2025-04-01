/*
  Warnings:

  - The values [FINISHED] on the enum `ModeStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ModeStatus_new" AS ENUM ('PENDING', 'ONGOING', 'COMPLETED');
ALTER TABLE "AcademicYear" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "AcademicYear" ALTER COLUMN "status" TYPE "ModeStatus_new" USING ("status"::text::"ModeStatus_new");
ALTER TYPE "ModeStatus" RENAME TO "ModeStatus_old";
ALTER TYPE "ModeStatus_new" RENAME TO "ModeStatus";
DROP TYPE "ModeStatus_old";
ALTER TABLE "AcademicYear" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
