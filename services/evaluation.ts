import { EvaluationModel, QuestionModel } from '../interfaces/index.ts';
import { Response } from 'express';
import prisma from '../prisma/index.ts';

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

export const createEvaluation = async (body: Omit<EvaluationModel, "id" | "questionList">) => {
    try {
        const response = await prisma.evaluation.create({
            data: body
        })
        return response;
    } catch (err) {
        throw err
    }
}

export const modifyEvaluation = async (id: string, data: Omit<EvaluationModel, "id" | "questionList">, res: Response) => {


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
            id: Number(id),
        },
        data,
    });
};

export const removeEvaluation = async (id: string) => {
    return await prisma.evaluation.delete({
        where: {
            id: Number(id)
        }
    })
}


export const getEvaluationQuestion = async (id: string) => {
    try {
        const response = await prisma.question.findMany({
            select: {
                id: true,
                question: true,
                evaluationId: true

            },
            where: {
                evaluationId: Number(id)
            },
            orderBy: {
                id: 'asc'
            }
        })

        return response;
    } catch (err) {
        throw err
    }
}


export const createEvaluationQuestion = async (body: Omit<QuestionModel, "id">) => {
    try {
        const response = await prisma.question.create({
            data: {
                question: body.question,
                Evaluation: {
                    connect: { id: body.evaluationId }
                }
            }
        })

        return response;
    } catch (err) {
        throw err
    }
}

export const modifyEvaluationQuestion = async (id: string, body: QuestionModel) => {
    try {



        const response = await prisma.question.update({
            data: {
                question: body.question,
            },
            where: {
                id: Number(id)
            }
        })

        return response;
    } catch (err) {
        throw err
    }
}

export const removeEvaluationQuestion = async (id: string) => {
    return await prisma.question.delete({
        where: {
            id: Number(id)
        }
    })
}

