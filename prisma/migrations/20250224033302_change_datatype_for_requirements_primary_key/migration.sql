/*
  Warnings:

  - The primary key for the `Requirements` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Requirements` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Requirements" DROP CONSTRAINT "Requirements_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Requirements_pkey" PRIMARY KEY ("id");
