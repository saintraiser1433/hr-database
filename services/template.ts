import { Template } from '@prisma/client';
import prisma from '../prisma/index.ts';

export const getAllTemplate = async () => {
    try {
        const response = await prisma.template.findMany({
            select: {
                id: true,
                template_name: true,
                description: true
            }
        })

        return response;
    } catch (err) {
        throw err
    }
}


export const createTemplate = async (data: Template) => {
    try {
        const response = await prisma.template.create({
            data
        })
        return response;
    } catch (err) {
        throw err
    }
}


export const updateTemplate = async (id: number, data: Template) => {
    return await prisma.template.update({
        where: {
            id: id,
        },
        data,
    });
};

export const removeTemplate = async (id: number) => {
    return await prisma.template.delete({
        where: {
            id: id
        }
    })
}






