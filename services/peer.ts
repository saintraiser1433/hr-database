import { PeerCategory, Question } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../prisma/index.ts";

//creation of peer to peer category
export const createEvaluationPeerCategory = async (body: PeerCategory) => {
    try {
        // Check before inserting
        await checkingPeerPercentage(body.academicYearId, body.percentage);

        const response = await prisma.peerCategory.create({
            data: {
                name: body.name,
                percentage: body.percentage,
                academicYear: {
                    connect: { id: body.academicYearId }
                }
            }
        });

        return response;
    } catch (err) {
        throw err;
    }
};

const checkingPeerPercentage = async (academicYearId: number, percentage: Decimal) => {
    try {
        const existingPeers = await prisma.peerCategory.findMany({
            select: { percentage: true },
            where: { academicYearId: academicYearId }
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
        const response = await prisma.peerCategory.findMany({
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
                academicYear: {
                    select: {
                        teamLeadTemplate: {
                            select: {
                                template_name: true
                            }
                        }
                    }
                }

            },
            where: {
                academicYearId: id
            },
            orderBy: {
                percentage: 'desc'
            }
        })

        const res = response.map((item) => ({
            ...item,
            template: item.academicYear?.teamLeadTemplate?.template_name
        }))
        return res;
    } catch (err) {
        throw err
    }
}

export const modifyEvaluationPeerCategory = async (id: number, body: PeerCategory) => {
    try {
        await checkingPeerPercentage(body.academicYearId, body.percentage);
        const response = await prisma.peerCategory.update({
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
    return await prisma.peerCategory.delete({
        where: {
            id: id
        }
    })
}



