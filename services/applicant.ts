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



export const getApplicantsOngoing = async () => {
    try {
        const response = await prisma.applicant.findMany({
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
                                    select: {
                                        title: true
                                    }
                                }
                            },
                            orderBy: {
                                sequence_number: 'asc'
                            }
                        },
                    }
                },
                applicantScreening: {
                    select: {
                        applicantId: true,
                        jobId: true,
                        screeningId: true,

                        status: true,

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

            },
            where: {
                status: 'ONGOING'
            },

        })
        return response.map(applicant => {
            const jobScreeningCount = applicant.jobApply?.JobScreening?.length || 0;
            const applicantScreeningCount = applicant.applicantScreening?.length || 0;
            const hasFailed = applicant.applicantScreening?.some(screening => screening.status === 'FAILED');
            const jobScreeningProgress = applicant.jobApply?.JobScreening.map((item) => {
                const title = item.screeningList.title
                return {
                    title
                }
            })
            return {
                id: applicant.id,
                photo: applicant.information.photo_path,
                jobId: applicant.jobId,
                jobTitle: applicant.jobApply?.title || "N/A",
                status: hasFailed ? 'FAILED' : applicant.status, // Per applicant, not globally
                applicantName: `${applicant.information.last_name}, ${applicant.information.first_name} ${applicant.information.middle_name || ''}`,
                appliedDate: applicant.createdAt,
                resume: applicant.information.resume_path,
                email: applicant.information.email,
                contactNumber: applicant.information.contact_number,
                countJobScreening: jobScreeningCount,
                countApplicantScreening: applicantScreeningCount,
                progressList: jobScreeningProgress
            };
        });
    } catch (err) {
        throw err
    }
}
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
                fullname: `${item.information.last_name}, ${item.information.first_name} ${item.information.middle_name}`,
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


export const proceedApplicant = async (id: string, rejectedDate: Date) => {
    const response = await prisma.applicant.update({
        data: {
            status: 'ONGOING',
        },
        select: {
            id: true,
            status: true,
            jobId: true,
            createdAt: true,
            jobApply: {
                select: {
                    title: true,
                    JobScreening: true,
                }
            },
            information: true

        },

        where: {
            id: Number(id)
        }
    })

    return response;

    // const serializedData = {
    //     id: response.id,
    //     status: response.status,
    //     jobId: response.jobApply.id,
    //     jobTitle: response.jobApply.title,

    //     photo: response.information.photo_path,
    //     fullname: `${response.information.last_name}, ${response.information.first_name} ${response.information.middle_name}`,
    //     appliedDate: response.createdAt,
    //     resume: response.information.resume_path,
    //     email: response.information.email,
    //     contactNumber: response.information.contact_number,

    // }

}

export const rejectApplicant = async (id: string, rejectedDate: Date) => {

    return await prisma.applicant.update({
        data: {
            status: 'REJECTED',
            rejectedAt: rejectedDate
        },
        where: {
            id: Number(id)
        }


    })
}










