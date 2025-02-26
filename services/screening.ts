import { JobScreeningModel, ScreeningModel } from '../types';
import prisma from '../prisma';

export const getScreenings = async () => {
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


export const createScreening = async (body: Omit<ScreeningModel, "id" | "JobScreening">) => {
    try {
        const response = await prisma.screening.create({
            data: body
        })
        return response;
    } catch (err) {
        throw err
    }
}


export const updateScreenings = async (id: string, body: Omit<ScreeningModel, "JobScreening">) => {
    return await prisma.screening.update({
        where: {
            id: Number(id),
        },
        data: body,
    });
};

export const deleteScreening = async (id: string) => {
    return await prisma.screening.delete({
        where: {
            id: Number(id)
        }
    })
}



//asigning
export const selectScreeningByJobId = async (jobId: string) => {
    try {
        const response = await prisma.screening.findMany({
            select: {
                id: true,
                title: true
            },
            where: {
                status: true,
                NOT: {
                    JobScreening: {
                        some: {
                            job_id: Number(jobId)
                        }
                    }
                }
            },
            orderBy: {
                title: 'asc'
            }
        })

        return response;
    } catch (err) {
        throw err;
    }
}

export const getJobScreenings = async () => {
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
                },
                sequence_number: true,
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

            },
            orderBy: {
                sequence_number: 'asc'
            }
        });


        const data = response.map((item) => ({
            job_id: Number(item.job_id),
            job_title: item.jobList.title,
            sequence_number: Number(item.sequence_number),
            screening_id: Number(item.screening_id),
            screening_title: item.screeningList.title
        }))




        return data;
    } catch (err) {
        throw err
    }
}


export const assignJobToScreening = async (body: Omit<JobScreeningModel, "jobList" | "screeningList">) => {
    try {

        const response = await prisma.jobScreening.createMany({
            data: body
        });
        return response;
    } catch (err) {
        throw err
    }
}




export const updateJobScreeningSequence = async (oldJobId: string, oldScreeningId: string) => {
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

export const deleteJobScreening = async (id: string) => {
    try {
        const response = await prisma.jobScreening.deleteMany({
            where: {
                id: Number(id)
            }
        });

        return response;
    } catch (err) {
        throw err;
    }
}












