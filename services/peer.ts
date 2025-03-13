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