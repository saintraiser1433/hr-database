import { JobScreeningModel, ScreeningModel } from '../interfaces';
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

export const getJobScreeningsByJobId = async (id: string) => {
    try {
        const response = await prisma.jobScreening.findMany({
            select: {
                id: true,
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
                AND: [
                    { jobList: { status: true } },
                    { screeningList: { status: true } },
                    { job_id: Number(id) }
                ]
            },
            orderBy: { sequence_number: 'asc' }
        });

        const data = response.map((item) => ({
            id: Number(item.id),
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


export const assignJobToScreening = async (body: Omit<JobScreeningModel, "id" | "screening_title " | "jobList" | "screeningList">) => {
    try {
        console.log(body);
        const response = await prisma.jobScreening.createMany({
            data: body
        });
        return response;
    } catch (err) {
        throw err
    }
}




export const updateJobScreeningSequence = async (id: string, direction: "up" | "down") => {
    try {


        const currentRow = await prisma.jobScreening.findUnique({
            where: { id: Number(id) },
            select: { sequence_number: true, job_id: true }, // Get job_id to ensure same job context
        });

        if (!currentRow) throw new Error("Job screening not found");

        const { sequence_number, job_id } = currentRow;
        const targetSeq = direction === "up" ? sequence_number - 1 : sequence_number + 1;

        // Find the row to swap with
        const targetRow = await prisma.jobScreening.findFirst({
            where: {
                job_id, // Ensure same job context
                sequence_number: targetSeq,
            },
            select: { id: true },
        });

        if (!targetRow) return; // No swap possible (out of bounds)

        // Swap sequence numbers using a transaction
        await prisma.$transaction([
            prisma.jobScreening.update({
                where: { id: Number(id) },
                data: { sequence_number: targetSeq },
            }),
            prisma.jobScreening.update({
                where: { id: targetRow.id },
                data: { sequence_number: sequence_number },
            }),
        ]);

        return;

        // return response;
    } catch (err) {
        throw err;
    }
}

export const deleteJobScreening = async (body: number[]) => {
    try {
        const response = await prisma.jobScreening.deleteMany({
            where: {
                id: {
                    in: body
                }
            }
        });

        return response;
    } catch (err) {
        throw err;
    }
}












