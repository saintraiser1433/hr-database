-- CreateTable
CREATE TABLE "ApplicantScreening" (
    "applicantId" INTEGER NOT NULL,
    "jobId" INTEGER NOT NULL,
    "screeningId" INTEGER NOT NULL,

    CONSTRAINT "ApplicantScreening_pkey" PRIMARY KEY ("applicantId","screeningId","jobId")
);

-- AddForeignKey
ALTER TABLE "ApplicantScreening" ADD CONSTRAINT "ApplicantScreening_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantScreening" ADD CONSTRAINT "ApplicantScreening_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantScreening" ADD CONSTRAINT "ApplicantScreening_screeningId_fkey" FOREIGN KEY ("screeningId") REFERENCES "Screening"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
