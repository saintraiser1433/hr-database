import { Peer, Question } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../prisma/index.ts";

//creation of peer to peer category
export const createEvaluationPeerCategory = async (body: Peer) => {
    try {
        // Check before inserting
        await checkingPeerPercentage(body.evaluationId, body.percentage);

        const response = await prisma.peer.create({
            data: {
                name: body.name,
                percentage: body.percentage,
                evaluation: {
                    connect: { id: body.evaluationId }
                }
            }
        });

        return response;
    } catch (err) {
        throw err;
    }
};

const checkingPeerPercentage = async (evaluationId: number, percentage: Decimal) => {
    try {
        const existingPeers = await prisma.peer.findMany({
            select: { percentage: true },
            where: { evaluationId: evaluationId }
        });

        const totalPercentage = existingPeers.reduce((sum, peer) => sum + Number(peer.percentage), 0) 
        + Number(percentage); 

        if (totalPercentage > 1) { 
            throw new Error('Cannot add because the total percentage exceeds 100%');
        }
    } catch (err) {
        throw err;
    }
};

export const getEvaluationPeerCategory = async (id: number) => {
    try {
        const response = await prisma.peer.findMany({
            select: {
                id: true,
                name: true,
                percentage: true,
                question: {
                    select: {
                        id: true,
                        question: true
                    }
                },
                template: {
                    select: {
                        template_name: true
                    }
                }
            },
            where: {
                evaluationId: id
            },
            orderBy: {
                percentage: 'desc'
            }
        })

        const res = response.map((item) => ({
            ...item,
            template: item.template?.template_name
        }))
        return res;
    } catch (err) {
        throw err
    }
}

export const modifyEvaluationPeerCategory = async (id: number, body: Peer) => {
    try {
        await checkingPeerPercentage(body.evaluationId, body.percentage);
        const response = await prisma.peer.update({
            data: {
                name: body.name,
                percentage: body.percentage
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
        const peerWithQuestions = await prisma.peer.findUnique({
            where: { id },
            select: {
                question: {
                    select: {
                        id: true,
                        question: true,
                        peerId: true,
                    },
                    orderBy: {
                        id: 'asc',
                    },
                },
                template: {
                    select: {
                        templateDetail: {
                            select: {
                                title: true,
                                score: true,
                            },
                            orderBy: {
                                score: 'asc',
                            },
                        },
                    },
                },
            },
        });

        if (!peerWithQuestions) {
            throw new Error(`Peer with id ${id} not found.`);
        }

        return {
            questions: peerWithQuestions.question,
            legends: peerWithQuestions.template?.templateDetail || [],
        };
    } catch (err) {
        console.error(`Error fetching evaluation peer question for id ${id}:`, err);
        throw err;
    }
};


export const createEvaluationPeerQuestion = async (body: Question) => {
    try {
        const response = await prisma.question.create({
            data: {
                question: body.question,
                peer: {
                    connect: { id: body.peerId as number }
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


//assign template 
export const bundleUpdateTemplatePeer = async (id: number, body: Peer) => {
    try {
        const response = await prisma.peer.updateMany({
            data: {
                templateHeaderId: body.templateHeaderId
            },
            where: {
                evaluationId: id
            }
        })


        return response;
    } catch (err) {
        throw err
    }
}


export const assignTemplatePeer = async (id: number, body: Peer) => {
    try {
        const response = await prisma.peer.update({
            data: {
                templateHeaderId: body.templateHeaderId
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