-- Step 1: Change status from ENUM to TEXT
BEGIN;
ALTER TABLE "EmployeeRequirements"
ALTER COLUMN "status" TYPE TEXT USING "status"::TEXT;
COMMIT;
