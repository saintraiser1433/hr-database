import { JobModel, RequirementModel } from '../types';
import prisma from '../prisma';

export const getJobService = async () => {
    try {
        const response = await prisma.job.findMany({
            select: {
                id:true,
                title: true,
                description: true,
                totalAvailable: true,
                status: true,
                imagePath: true
            }
        })

        return response;
    } catch (err) {
        throw err
    }
}


export const createJobService = async (body: Omit<JobModel, "id" | "JobScreening">) => {
    try {
        const response = await prisma.job.create({
            data: body
        })
        return response;
    } catch (err) {
        throw err
    }
}


export const updateJobService = async (id: string, body: Omit<JobModel, "JobScreening">) => {
    return await prisma.job.update({
        where: {
            id: Number(id),
        },
        data: body,
    });
};

export const removeJobService = async (id: string) => {
    return await prisma.job.delete({
        where: {
            id: Number(id)
        }
    })
}






