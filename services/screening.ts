import { ScreeningModel } from '../types';
import prisma from '../prisma';

export const getScreeningService = async () => {
    try {
        const response = await prisma.screening.findMany({
            select: {
                id:true,
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






