-- AlterTable
ALTER TABLE "JobScreening" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "JobScreening_pkey" PRIMARY KEY ("id");
