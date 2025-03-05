import { ApplicationStatus, ScreeningStatus } from '@prisma/client';
import { ApplicantModel } from '../interfaces';
import prisma from '../prisma';

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


export const getApplicantsOngoing = async () => {
    try {
        const response = await prisma.applicant.findMany({
            where: { status: 'ONGOING' },
            select: {
                id: true,
                status: true,
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
                jobScreeningProgress.push(screening.screening.title)
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
                jobTitle: applicant.jobApply?.title || "N/A",
                status: applicant.status,
                applicantName: `${applicant.information.last_name}, ${applicant.information.first_name} ${applicant.information.middle_name || ''}`,
                appliedDate: applicant.createdAt,
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




export const createApplicants = async (data: Omit<ApplicantModel, 'id'>) => {
    try {
        const response = await prisma.applicant.create({
            data: {
                jobApply: { connect: { id: data.jobId } },
                information: {
                    create: {
                        first_name: data.first_name,
                        middle_name: data.middle_name,
                        last_name: data.last_name,
                        email: data.email,
                        contact_number: data.contact_number,
                        resume_path: data.resume_path,
                        photo_path: data.photo_path,
                    }
                }
            },
            include: {
                jobApply: true,
                information: true
            }
        })
        return response;
    } catch (err) {
        throw err
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


export const updateFinalizedApplicantStatus = async (id: string, status: ApplicationStatus) => {
    try {
        const apResultId = parseInt(id, 10);
        if (isNaN(apResultId)) throw new Error("Invalid applicant ID.");

        // Determine the update data
        const updateData: Record<string, any> = { status };
        if (status === 'PASSED') updateData.approvedAt = new Date();
        if (status === 'FAILED') updateData.failedAt = new Date();

        // Update applicant status
        const response = await prisma.applicant.update({
            where: { id: apResultId },
            data: updateData
        });

        return {
            id: response.id,
            status: response.status
        };

    } catch (error) {
        throw error;
    }
};













