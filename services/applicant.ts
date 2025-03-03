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
                status: item.status,
                fullname: `${item.information.last_name}, ${item.information.first_name} ${item.information.middle_name}`,
                applied_date: item.createdAt,
                resume: item.information.resume_path,
                email: item.information.email,
                contact_number: item.information.contact_number
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
            include: {
                jobApply: true,
                information: true
            },
            where: {
                status: 'ONGOING'
            }
        })
        return response;
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
                status: item.status,
                fullname: `${item.information.last_name}, ${item.information.first_name} ${item.information.middle_name}`,
                applied_date: item.createdAt,
                resume: item.information.resume_path,
                email: item.information.email,
                contact_number: item.information.contact_number,
                rejected_date: item.rejectedAt,
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


export const rejectApplicant = async (id: string) => {
    return await prisma.applicant.update({
        data: {
            status: 'REJECTED'
        },
        where: {
            id: Number(id)
        }
    })
}










