-- CreateTable
CREATE TABLE "Requirements" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requirements_pkey" PRIMARY KEY ("id")
);
