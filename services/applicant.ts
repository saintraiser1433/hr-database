import { ApplicantModel } from '../interfaces';
import prisma from '../prisma';

export const getApplicants = async () => {
    try {
        const response = await prisma.applicant.findMany({
            include: {
                jobApply: true,
                information: true
            },
            where: {
                OR: [
                    {
                        status: 'ONGOING',
                    },
                    {
                        status: 'PENDING',
                    },
                ]


            }
        })

        return response;
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
                        resume_path: data.resume_path
                    }
                }
            },
            include: {
                jobApply: true,
                information:true
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










