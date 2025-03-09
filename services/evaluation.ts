import { EvaluationModel, QuestionModel } from '../interfaces/index.ts';
import { Response } from 'express';
import prisma from '../prisma/index.ts';
import { Evaluation, Peer, Question } from '@prisma/client';

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

//creation of peer to peer category
export const createEvaluationPeerCategory = async (body: Peer) => {
    try {
        const response = await prisma.peer.create({
            data: {
                title: body.title,
                evaluation: {
                    connect: { id: body.evaluationId }
                }
            }
        })

        return response;
    } catch (err) {
        throw err
    }
}

export const getEvaluationPeerCategory = async (id: number) => {
    try {
        const response = await prisma.peer.findMany({
            select: {
                id: true,
                title: true,
                question: {
                    select: {
                        id: true,
                        question: true
                    }
                },
            },
            where: {
                evaluationId: id
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

export const modifyEvaluationPeerCategory = async (id: number, body: Peer) => {
    try {
        const response = await prisma.peer.update({
            data: {
                title: body.title,
            },
            where: {
                id: id
            }
        })

        return response;
    } catch (err) {
        throw err
    }
}

export const removeEvaluationPeerCategory = async (id: number) => {
    return await prisma.peer.delete({
        where: {
            id: id
        }
    })
}

//end




//peer questions
export const getEvaluationPeerQuestion = async (id: number) => {
    try {
        const response = await prisma.question.findMany({
            select: {
                id: true,
                question: true,
                peerId: true

            },
            where: {
                peerId: id
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


export const createEvaluationPeerQuestion = async (body: Question) => {
    try {
        const response = await prisma.question.create({
            data: {
                question: body.question,
                peer: {
                    connect: { id: body.peerId }
                }
            }
        })

        return response;
    } catch (err) {
        throw err
    }
}

export const modifyEvaluationPeerQuestion = async (id: number, body: Question) => {
    try {
        const response = await prisma.question.update({
            data: {
                question: body.question,
            },
            where: {
                id: id
            }
        })

        return response;
    } catch (err) {
        throw err
    }
}

export const removeEvaluationPeerQuestion = async (id: number) => {
    return await prisma.question.delete({
        where: {
            id: id
        }
    })
}


//end peer questions
