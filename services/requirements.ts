import { RequirementModel } from '../interfaces';
import prisma from '../prisma';

export const getRequirementService = async () => {
    try {
        const response = await prisma.requirements.findMany({
            select: {
                id: true,
                title: true,
                description: true
            }
        })

        return response;
    } catch (err) {
        throw err
    }
}


export const createRequirementService = async (data: Omit<RequirementModel, "id" | "Job">) => {
    try {
        const response = await prisma.requirements.create({
            data
        })
        return response;
    } catch (err) {
        throw err
    }
}


export const updateRequirementService = async (id: string, data: Omit<RequirementModel, "id" | "Job">) => {
    return await prisma.requirements.update({
        where: {
            id: Number(id),
        },
        data,
    });
};

export const removeRequirementService = async (id: string) => {
    return await prisma.requirements.delete({
        where: {
            id: Number(id)
        }
    })
}






