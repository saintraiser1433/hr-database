-- CreateTable
CREATE TABLE "SMS" (
    "serverAddress" TEXT NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,

    CONSTRAINT "SMS_pkey" PRIMARY KEY ("serverAddress")
);
