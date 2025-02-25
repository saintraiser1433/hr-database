import { JobScreeningModel, ScreeningModel } from '../types';
import prisma from '../prisma';

export const getScreeningService = async () => {
    try {
        const response = await prisma.screening.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
            }
        })

        return response;
    } catch (err) {
        throw err
    }
}


export const createScreeningService = async (body: Omit<ScreeningModel, "id" | "JobScreening">) => {
    try {
        const response = await prisma.screening.create({
            data: body
        })
        return response;
    } catch (err) {
        throw err
    }
}


export const updateScreeningService = async (id: string, body: Omit<ScreeningModel, "JobScreening">) => {
    return await prisma.screening.update({
        where: {
            id: Number(id),
        },
        data: body,
    });
};

export const removeScreeningService = async (id: string) => {
    return await prisma.screening.delete({
        where: {
            id: Number(id)
        }
    })
}



//asigning

export const assignJobScreeningService = async (body: Omit<JobScreeningModel, "id">) => {
    try {
        const response = await prisma.jobScreening.create({
            data: {
                jobList: {
                    connect: { id: Number(body.job_id) }
                },
                screeningList: {
                    connect: { id: Number(body.screening_id) }
                }
            }
        })
        return response;
    } catch (err) {
        throw err
    }
}

export const updateAssignJobScreeningService = async (oldJobId: string, oldScreeningId: string, body: Omit<JobScreeningModel, "id">) => {
    try {
        const response = await prisma.$transaction(async (tx) => {
            await tx.jobScreening.delete({
                where: {
                    job_id_screening_id: {
                        job_id: Number(oldJobId),
                        screening_id: Number(oldScreeningId)
                    }
                }
            });
            return await tx.jobScreening.create({
                data: {
                    jobList: {
                        connect: { id: Number(body.job_id) }
                    },
                    screeningList: {
                        connect: { id: Number(body.screening_id) }
                    }
                }
            });
        });

        return response;
    } catch (err) {
        throw err; // You can also handle specific errors here
    }
};

export const deleteAssignJobScreeningService = async (oldJobId: string, oldScreeningId: string) => {
    try {
        const response = await prisma.jobScreening.delete({
            where: {
                job_id_screening_id: {
                    job_id: Number(oldJobId),
                    screening_id: Number(oldScreeningId)
                }
            }
        });

        return response;
    } catch (err) {
        throw err;
    }


}



export const getAllJobScreeningService = async () => {
    try {
        const response = await prisma.jobScreening.findMany({
            select: {
                job_id: true,
                screening_id: true,
                jobList: {
                    select: {
                        title: true,
                        description: true,
                    }
                },
                screeningList: {
                    select: {
                        title: true,
                        description: true
                    }
                }
            },
            where: {
                AND: [{
                    jobList: {
                        status: true
                    }
                },
                {
                    screeningList: {
                        status: true
                    }
                }]

            }
        })
        return response;
    } catch (err) {
        throw err
    }
}






