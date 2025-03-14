-- CreateTable
CREATE TABLE "TeamLeadEvaluationHeader" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamLeadEvaluationHeader_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamLeadEvaluationHeader_employeeId_key" ON "TeamLeadEvaluationHeader"("employeeId");

-- AddForeignKey
ALTER TABLE "TeamLeadEvaluationHeader" ADD CONSTRAINT "TeamLeadEvaluationHeader_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
