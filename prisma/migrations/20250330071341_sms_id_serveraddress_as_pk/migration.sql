/*
  Warnings:

  - A unique constraint covering the columns `[serverAddress]` on the table `SMS` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SMS_serverAddress_key" ON "SMS"("serverAddress");
