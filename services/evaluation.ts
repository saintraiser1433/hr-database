import prisma from '../prisma/index.ts';
import { Evaluation } from '@prisma/client';

export const getEvaluation = async () => {
    try {
        const response = await prisma.evaluation.findMany({
            select: {
                id: true,
                school_year: true,
                semester: true,
                status: true
            },
            orderBy: [
                {
                    school_year: 'asc',
                },
                {
                    semester: 'asc'
                },

            ]
        })

        return response;
    } catch (err) {
        throw err
    }
}

export const createEvaluation = async (body: Evaluation) => {
    try {
        const response = await prisma.evaluation.create({
            data: body
        })
        return response;
    } catch (err) {
        throw err
    }
}

export const modifyEvaluation = async (id: number, data: Evaluation) => {

    try {
        const checkDuplicateStatus = await prisma.evaluation.findFirst({
            where: {
                status: 'ONGOING'
            }
        });
        if (checkDuplicateStatus) {
            throw new Error("Please update the ongoing status to finished before update");
        }

        return await prisma.evaluation.update({
            where: {
                id: id
            },
            data,
        });
    } catch (err) {
        throw err
    }

};

export const removeEvaluation = async (id: number) => {
    return await prisma.evaluation.delete({
        where: {
            id: id
        }
    })
}

