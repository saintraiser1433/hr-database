import { ApplicationStatus } from '@prisma/client';
import { ApplicantModel } from '../interfaces/index.ts';
import prisma from '../prisma/index.ts';
import fs from 'fs';
import path from 'path';
export const getApplicantsPending = async () => {
    try {
        const response = await prisma.applicant.findMany({
            include: {
                jobApply: true,
                information: true
            },
            where: {
                status: 'PENDING'
            }
        })

        const serializedData = response.map((item) => {
            return {
                id: item.id,
                photo: item.information.photo_path,
                jobId: item.jobApply.id,
                jobTitle: item.jobApply.title,
                status: item.status,
                applicantName: `${item.information.last_name}, ${item.information.first_name} ${item.information.middle_name}`,
                appliedDate: item.createdAt,
                resume: item.information.resume_path,
                email: item.information.email,
                contactNumber: item.information.contact_number
            }
        });


        return serializedData;
    } catch (err) {
        throw err
    }
}


export const getApplicantsFailed = async () => {
    try {
        const response = await prisma.applicant.findMany({
            include: {
                jobApply: true,
                information: true
            },
            where: {
                status: 'FAILED'
            }
        })

        const serializedData = response.map((item) => {
            return {
                id: item.id,
                photo: item.information.photo_path,
                jobId: item.jobApply.id,
                jobTitle: item.jobApply.title,
                status: item.status,
                applicantName: `${item.information.last_name}, ${item.information.first_name} ${item.information.middle_name}`,
                appliedDate: item.createdAt,
                failedDate: item.failedAt,
            }
        });


        return serializedData;
    } catch (err) {
        throw err
    }
}

export const getApplicantsPassed = async () => {
    try {
        const response = await prisma.applicant.findMany({
            include: {
                jobApply: true,
                information: true
            },
            where: {
                status: 'PASSED',
            }
        })

        const serializedData = response.map((item) => {
            return {
                id: item.id,
                photo: item.information.photo_path,
                jobId: item.jobApply.id,
                jobTitle: item.jobApply.title,
                status: item.status,
                applicantName: `${item.information.last_name}, ${item.information.first_name} ${item.information.middle_name}`,
                appliedDate: item.createdAt,
                passedDate: item.approvedAt,
            }
        });


        return serializedData;
    } catch (err) {
        throw err
    }
}

export const getFailApprvStatusByApplicant = async (id: string) => {
    try {
        const applicantId = parseInt(id, 10);
        if (isNaN(applicantId)) throw new Error("Invalid applicant ID.");
        const response = await prisma.applicant.findMany({
            where: {
                id: applicantId,
                OR: [
                    { status: 'FAILED' },
                    { status: 'PASSED' },
                ]
            },

            select: {
                id: true,
                status: true,
                jobId: true,
                createdAt: true,
                jobApply: {
                    select: {
                        title: true,
                        JobScreening: {
                            select: {
                                screening_id: true,
                                sequence_number: true,
                                screeningList: {
                                    select: { title: true }
                                }
                            },
                            orderBy: { sequence_number: 'asc' }
                        },
                    }
                },
                applicantScreeningResult: {
                    select: {
                        id: true,
                        screeningId: true,
                        status: true,
                        dateInterview: true,
                        sequence_number: true,
                        screening: { select: { title: true, } }
                    }
                },
                information: {
                    select: {
                        id: true,
                        first_name: true,
                        middle_name: true,
                        last_name: true,
                        email: true,
                        contact_number: true,
                        resume_path: true,
                        photo_path: true,
                    }
                },

            },

        });

        return response.map(applicant => {
            const screeningResults = applicant.applicantScreeningResult.sort((a, b) => a.sequence_number - b.sequence_number);
            const jobScreeningCount = screeningResults.length;
            let applicantScreeningCount = 0;
            let hasFailed = false;

            // **Process all applicant screening results in one loop**
            for (const screening of screeningResults) {
                if (screening.status !== 'PENDING') applicantScreeningCount++;
                if (screening.status === 'FAILED') hasFailed = true;
            }

            // **Determine remarks efficiently**
            let remarks = 'FAILED';
            if (!hasFailed) {
                if (jobScreeningCount === 0) remarks = 'ONGOING';
                else if (jobScreeningCount === applicantScreeningCount) remarks = 'PASSED';
                else remarks = 'ONGOING';
            }

            return {
                id: applicant.id,
                photo: applicant.information.photo_path,
                jobId: applicant.jobId,
                jobTitle: applicant.jobApply?.title || "N/A",
                status: applicant.status,
                applicantName: `${applicant.information.last_name}, ${applicant.information.first_name} ${applicant.information.middle_name || ''}`,
                appliedDate: applicant.createdAt,
                resume: applicant.information.resume_path,
                email: applicant.information.email,
                contactNumber: applicant.information.contact_number,
                countJobScreening: jobScreeningCount,
                countApplicantScreening: applicantScreeningCount,
                progressList: screeningResults,
                remarks
            };
        });

    } catch (err) {
        console.error("Error fetching ongoing applicants:", err);
        throw err;
    }
};


export const getOngoingStatusByApplicant = async (id: string) => {
    try {
        const applicantId = parseInt(id, 10);
        if (isNaN(applicantId)) throw new Error("Invalid applicant ID.");
        const response = await prisma.applicant.findMany({
            where: {
                AND: [
                    { status: 'ONGOING' },
                    { id: applicantId },
                ]
            },

            select: {
                id: true,
                status: true,
                jobId: true,
                createdAt: true,
                jobApply: {
                    select: {
                        title: true,
                        JobScreening: {
                            select: {
                                screening_id: true,
                                sequence_number: true,
                                screeningList: {
                                    select: { title: true }
                                }
                            },
                            orderBy: { sequence_number: 'asc' }
                        },
                    }
                },
                applicantScreeningResult: {
                    select: {
                        id: true,
                        screeningId: true,
                        status: true,
                        dateInterview: true,
                        sequence_number: true,
                        screening: { select: { title: true, } }
                    }
                },
                information: {
                    select: {
                        id: true,
                        first_name: true,
                        middle_name: true,
                        last_name: true,
                        email: true,
                        contact_number: true,
                        resume_path: true,
                        photo_path: true,
                    }
                },

            },

        });

        return response.map(applicant => {
            const screeningResults = applicant.applicantScreeningResult
                .sort((a, b) => a.sequence_number - b.sequence_number); // Sort by sequence_number (ascending)

            let currentStage = null;
            let nextStage = null;
            let nextSched = null;

            for (let i = 0; i < screeningResults.length; i++) {
                const screening = screeningResults[i];

                if (screening.status === ApplicationStatus.PENDING) {
                    if (!currentStage) {
                        currentStage = screening.screening.title;
                    } else if (!nextStage) {
                        nextStage = screening.screening.title;
                        nextSched = screening.dateInterview;
                        break;
                    }
                }
            }

            return {
                id: applicant.id,
                photo: applicant.information.photo_path,
                jobId: applicant.jobId,
                jobTitle: applicant.jobApply?.title || "N/A",
                status: applicant.status,
                applicantName: `${applicant.information.last_name}, ${applicant.information.first_name} ${applicant.information.middle_name || ''}`,
                appliedDate: applicant.createdAt,
                resume: applicant.information.resume_path,
                email: applicant.information.email,
                contactNumber: applicant.information.contact_number,
                countJobScreening: screeningResults.length,
                countApplicantScreening: screeningResults.filter(s => s.status !== 'PENDING').length,
                progressList: screeningResults,
                currentStage, // First "PENDING" stage (smallest sequence_number)
                nextStep: nextStage, // Next "PENDING" stage after the currentStage
                nextSched, // Interview date for the next step
                remarks: screeningResults.some(s => s.status === 'FAILED') ? 'FAILED' :
                    (screeningResults.every(s => s.status !== 'PENDING') ? 'PASSED' : 'ONGOING')
            };
        });



    } catch (err) {
        console.error("Error fetching ongoing applicants:", err);
        throw err;
    }
};


export const getApplicantsOngoing = async () => {
    try {
        const response = await prisma.applicant.findMany({
            where: { status: 'ONGOING' },
            select: {
                id: true,
                status: true,
                jobId: true,
                createdAt: true,
                jobApply: {
                    select: {
                        title: true,
                        JobScreening: {
                            select: {
                                screening_id: true,
                                sequence_number: true,
                                screeningList: {
                                    select: { title: true }
                                }
                            },
                            orderBy: { sequence_number: 'asc' }
                        },
                    },

                },
                applicantScreeningResult: {
                    select: {
                        screeningId: true,
                        status: true,
                        sequence_number: true,
                        screening: { select: { title: true } }
                    }
                },
                information: {
                    select: {
                        id: true,
                        first_name: true,
                        middle_name: true,
                        last_name: true,
                        email: true,
                        contact_number: true,
                        resume_path: true,
                        photo_path: true,
                    }
                }
            }
        });

        return response.map(applicant => {
            const screeningResults = applicant.applicantScreeningResult.sort((a, b) => a.sequence_number - b.sequence_number);
            const jobScreeningCount = screeningResults.length;
            let applicantScreeningCount = 0;
            let hasFailed = false;
            let jobScreeningProgress: string[] = [];

            // **Process all applicant screening results in one loop**
            for (const screening of screeningResults) {
                jobScreeningProgress.push(screening.screening.title);
                if (screening.status !== 'PENDING') applicantScreeningCount++;
                if (screening.status === 'FAILED') hasFailed = true;
            }

            // **Determine remarks efficiently**
            let remarks = 'FAILED';
            if (!hasFailed) {
                if (jobScreeningCount === 0) remarks = 'ONGOING';
                else if (jobScreeningCount === applicantScreeningCount) remarks = 'PASSED';
                else remarks = 'ONGOING';
            }

            return {
                id: applicant.id,
                photo: applicant.information.photo_path,
                jobId: applicant.jobId,
                jobTitle: applicant.jobApply?.title || "N/A",
                status: applicant.status,
                applicantName: `${applicant.information.last_name}, ${applicant.information.first_name} ${applicant.information.middle_name || ''}`,
                appliedDate: applicant.createdAt,
                resume: applicant.information.resume_path,
                email: applicant.information.email,
                contactNumber: applicant.information.contact_number,
                countJobScreening: jobScreeningCount,
                countApplicantScreening: applicantScreeningCount,
                progressList: jobScreeningProgress,
                remarks
            };
        });

    } catch (err) {
        console.error("Error fetching ongoing applicants:", err);
        throw err;
    }
};

export const getApplicantsRejected = async () => {
    try {
        const response = await prisma.applicant.findMany({
            include: {
                jobApply: true,
                information: true
            },
            where: {
                status: 'REJECTED'
            }
        })

        const serializedData = response.map((item) => {
            return {
                id: item.id,
                photo: item.information.photo_path,
                jobId: item.jobApply.id,
                jobTitle: item.jobApply.title,
                status: item.status,
                applicantName: `${item.information.last_name}, ${item.information.first_name} ${item.information.middle_name}`,
                appliedDate: item.createdAt,
                resume: item.information.resume_path,
                email: item.information.email,
                contactNumber: item.information.contact_number,
                rejectedDate: item.rejectedAt,
            }
        });

        return serializedData;
    } catch (err) {
        throw err
    }
}






export const createApplicants = async (
    data: Omit<ApplicantModel, 'id'>,
    resume: string,
    photo: string
) => {
    // Validate required fields
    if (!data.jobId || !resume || !photo) {
        throw new Error('Missing required fields or files.');
    }

    try {

        const response = await prisma.$transaction(async (prisma) => {
            const exists = await checkingIfApplicantExist(data.first_name, data.last_name);
            if (!exists) {
                const applicant = await prisma.applicant.create({
                    data: {
                        jobApply: { connect: { id: Number(data.jobId) } },
                        information: {
                            create: {
                                first_name: data.first_name,
                                middle_name: data.middle_name,
                                last_name: data.last_name,
                                email: data.email,
                                contact_number: data.contact_number,
                                resume_path: resume,
                                photo_path: photo,
                            },
                        },
                    },
                    include: {
                        jobApply: true,
                        information: true,
                    },
                });

                return applicant;
            }

        });

        return response;
    } catch (err) {
        if (resume) {
            fs.unlink(path.join('public/resume', resume), () => { });
        }
        if (photo) {
            fs.unlink(path.join('public/avatar', photo), () => { });
        }
        throw err;
    }
};


const checkingIfApplicantExist = async (first_name: string, last_name: string) => {
    try {
        const response = await prisma.applicantInformation.findFirst({
            where: {
                AND: [
                    {
                        first_name: {
                            equals: first_name,
                            mode: 'insensitive' // Case-insensitive comparison
                        }
                    },
                    {
                        last_name: {
                            equals: last_name,
                            mode: 'insensitive' // Case-insensitive comparison
                        }
                    },
                ]
            },
            select: {
                Applicant: {
                    select: {
                        createdAt: true
                    }
                }
            }
        });

        if (response && response.Applicant) { // Added null check for Applicant
            const createdAt = response.Applicant[0].createdAt;
            const now = new Date();
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            if (createdAt > sevenDaysAgo) {
                const nextAvailableDate = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
                const daysLeft = Math.ceil((nextAvailableDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                throw new Error(`You've already applied recently. Please try again after ${daysLeft} day(s).`);
            }
        }

        return false;
    } catch (err) {
        throw err;
    }
}



export const ongoingApplicants = async (id: string) => {
    try {
        const applicantId = parseInt(id, 10);
        if (isNaN(applicantId)) throw new Error("Invalid applicant ID.");

        const response = await prisma.$transaction(async (prisma) => {
            const updatedApplicant = await prisma.applicant.update({
                where: { id: applicantId },
                data: { status: 'ONGOING' },
                select: {
                    id: true,
                    jobId: true,
                    status: true,
                    createdAt: true,
                    jobApply: {
                        select: {
                            title: true,
                            JobScreening: {
                                select: {
                                    screening_id: true,
                                    sequence_number: true
                                },
                                orderBy: { sequence_number: 'asc' }
                            }
                        }
                    },
                    information: {
                        select: {
                            id: true,
                            first_name: true,
                            middle_name: true,
                            last_name: true,
                            email: true,
                            contact_number: true,
                            resume_path: true,
                            photo_path: true,
                        }
                    }
                }
            });

            const screeningList = updatedApplicant.jobApply?.JobScreening || [];
            if (screeningList.length > 0) {
                await prisma.applicantScreeningResult.createMany({
                    data: screeningList.map((screening) => ({
                        applicantId: updatedApplicant.id,
                        screeningId: screening.screening_id,
                        status: "PENDING",
                        sequence_number: screening.sequence_number
                    }))
                });
            }

            // Fetch all applicantScreeningResults in a single query
            const updatedApplicantResult = await prisma.applicantScreeningResult.findMany({
                where: { applicantId: updatedApplicant.id },
                include: { screening: { select: { title: true } } }
            });

            return { ...updatedApplicant, updatedApplicantResult };
        });

        // Process `updatedApplicantResult` in one loop
        let jobScreeningCount = 0;
        let applicantScreeningCount = 0;
        let hasFailed = false;
        let jobScreeningProgress: string[] = [];

        for (const screening of response.updatedApplicantResult) {
            jobScreeningCount++;
            jobScreeningProgress.push(screening.screening.title);
            if (screening.status !== 'PENDING') applicantScreeningCount++;
            if (screening.status === 'FAILED') hasFailed = true;
        }

        // Determine `remarks` efficiently
        let remarks = 'FAILED';
        if (!hasFailed) {
            if (jobScreeningCount === 0) remarks = 'ONGOING';
            else if (jobScreeningCount === applicantScreeningCount) remarks = 'PASSED';
            else remarks = 'ONGOING';
        }

        return {
            id: response.id,
            photo: response.information.photo_path,
            jobId: response.jobId,
            jobTitle: response.jobApply?.title || "N/A",
            status: response.status,
            applicantName: `${response.information.last_name}, ${response.information.first_name} ${response.information.middle_name || ''}`,
            appliedDate: response.createdAt,
            resume: response.information.resume_path,
            email: response.information.email,
            contactNumber: response.information.contact_number,
            countJobScreening: jobScreeningCount,
            countApplicantScreening: applicantScreeningCount,
            progressList: jobScreeningProgress,
            remarks
        };

    } catch (err) {
        console.error("Error in ongoingApplicants:", err);
        throw err;
    }
};


export const rejectApplicant = async (id: string) => {
    try {
        const response = await prisma.applicant.update({
            data: {
                status: 'REJECTED',
                rejectedAt: new Date()
            },
            include: {
                jobApply: true,
                information: true
            },

            where: {
                id: Number(id)
            }


        })

        const serializedData = {
            id: response.id,
            photo: response.information.photo_path,
            jobId: response.jobApply.id,
            jobTitle: response.jobApply.title,
            status: response.status,
            applicantName: `${response.information.last_name}, ${response.information.first_name} ${response.information.middle_name}`,
            appliedDate: response.createdAt,
            resume: response.information.resume_path,
            email: response.information.email,
            contactNumber: response.information.contact_number,
            rejectedDate: response.rejectedAt,
        }


        return serializedData;
    } catch (err) {
        throw err;
    }

}



export const updateFinalizedApplicantStatus = async (
    applicantId: number,
    jobId: number,
    status: ApplicationStatus
) => {
    // Move these outside the transaction if possible
    const { customAlphabet } = await import("nanoid");
    const nanoid = customAlphabet("1234567890abcdef", 5);
    const random5DigitNumber = Math.floor(10000 + Math.random() * 90000);

    const transaction = await prisma.$transaction(async (tx) => {
        // Validate status
        if (!["PASSED", "FAILED"].includes(status)) {
            throw new Error('Invalid application status');
        }

        // Check job availability first if status is PASSED
        if (status === "PASSED") {
            const job = await tx.job.findUnique({
                where: { id: jobId },
                select: { totalAvailable: true }
            });

            if (!job || job.totalAvailable <= 0) {
                throw new Error('This job has no available positions');
            }

            await tx.job.update({
                where: { id: jobId },
                data: { totalAvailable: { decrement: 1 } }
            });
        }

        // Update applicant status
        const updateData = { 
            status,
            ...(status === "PASSED" && { approvedAt: new Date() }),
            ...(status === "FAILED" && { failedAt: new Date() })
        };

        const response = await tx.applicant.update({
            where: { id: applicantId },
            data: updateData,
            select: {
                id: true,
                status: true,
                jobId: true,
                informationId: true,
                jobApply: {
                    select: {
                        departmentsId: true,
                    },
                },
                information: {
                    select: {
                        first_name: true,
                        last_name: true,
                    },
                },
            },
        });

        if (status === "PASSED") {
            const firstName = response.information.first_name.toLowerCase();
            const lastName = response.information.last_name.toLowerCase();
            const shortFirstName = firstName.slice(-3);
            const username = `${shortFirstName}_${lastName}_${random5DigitNumber}`;

            const employeesResponse = await tx.employees.create({
                data: {
                    job: { connect: { id: response.jobId } },
                    information: { connect: { id: response.informationId } },
                    department: { connect: { id: response.jobApply.departmentsId } },
                    username: username,
                    password: nanoid(),
                },
                select: {
                    id: true,
                    job: {
                        select: {
                            requirements: {
                                select: { id: true },
                                where: { status: true }
                            }
                        }
                    }
                }
            });

            if (!employeesResponse.job) {
                throw new Error("Error during insertion of employees");
            }
            if (employeesResponse?.job.requirements.length > 0) {
                await tx.employeeRequirements.createMany({
                    data: employeesResponse.job.requirements.map(requirement => ({
                        employeeId: employeesResponse.id,
                        requirementsId: requirement.id
                    }))
                });
            }
        }

        return {
            id: response.id,
            status: response.status,
        };
    });

    return transaction;
};


export const getApplicantCountByJob = async() => {
    try{
        const result = await prisma.$queryRaw`
        SELECT 
          j.title as Job,
          SUM(CASE WHEN a.status = 'PENDING' THEN 1 ELSE 0 END)::integer as Pending,
          SUM(CASE WHEN a.status = 'ONGOING' THEN 1 ELSE 0 END)::integer as Ongoing,
          SUM(CASE WHEN a.status = 'PASSED' THEN 1 ELSE 0 END)::integer as Passed,
          SUM(CASE WHEN a.status = 'REJECTED' THEN 1 ELSE 0 END)::integer as Rejected,
          SUM(CASE WHEN a.status = 'FAILED' THEN 1 ELSE 0 END)::integer as Failed,
          COUNT(a.id)::integer as TotalApplicants
        FROM 
          "Job" j
        LEFT JOIN 
          "Applicant" a ON j.id = a."jobId"
        GROUP BY 
          j.id, j.title
      `;

      return result;
    }catch(err){
        throw err;
    }
}

export const getApplicantTopJob = async() => {
    try{
        const filteredApplicantCounts = await prisma.$queryRaw`
        SELECT 
          j.title as name,
          COUNT(a.id)::integer as value
          /* status counts */
        FROM 
          "Job" j
        LEFT JOIN 
          "Applicant" a ON j.id = a."jobId"
        WHERE 
          j.status = true
        GROUP BY 
         j.title
      `;

      return filteredApplicantCounts;
    }catch(err){
        throw err;
    }
}










