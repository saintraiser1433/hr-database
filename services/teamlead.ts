import { Peer, Question, TeamLeadCriteria, TeamLeadEvaluation } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../prisma/index.ts";


export const createEvaluationTeamLeadCategory = async (body: TeamLeadEvaluation) => {
    try {
        await checkingTeamLeadPercentage(body.evaluationId, body.percentage);

        const response = await prisma.teamLeadEvaluation.create({
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

const checkingTeamLeadPercentage = async (evaluationId: number, percentage: Decimal) => {
    try {
        const existingTeamLead = await prisma.teamLeadEvaluation.findMany({
            select: { percentage: true },
            where: { evaluationId: evaluationId }
        });

        const totalPercentage = existingTeamLead.reduce((sum, peer) => sum + Number(peer.percentage), 0)
            + Number(percentage);

        if (totalPercentage > 1) {
            throw new Error('Cannot add because the total percentage exceeds 100%');
        }
    } catch (err) {
        throw err;
    }
};

export const getEvaluationTeamLeadCategory = async (id: number) => {
    try {
        const response = await prisma.teamLeadEvaluation.findMany({
            select: {
                id: true,
                name: true,
                percentage: true,
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

export const modifyEvaluationTeamLeadCategory = async (id: number, body: TeamLeadEvaluation) => {
    try {
        const response = await prisma.teamLeadEvaluation.update({
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

export const removeEvaluationTeamLeadCategory = async (id: number) => {
    return await prisma.teamLeadEvaluation.delete({
        where: {
            id: id
        }
    })
}

//end


//subcategory
export const createEvaluationTeamLeadCriteria = async (body: TeamLeadCriteria) => {
    try {
        const response = await prisma.teamLeadCriteria.create({
            data: {
                name: body.name,
                teamLeadEvaluation: {
                    connect: { id: body.teamLeadEvaluationId }
                }
            }
        });

        return response;
    } catch (err) {
        throw err;
    }
};


export const getEvaluationTeamLeadCriteria = async (id: number) => {
    try {
        const response = await prisma.teamLeadCriteria.findMany({
            select: {
                id: true,
                name: true,
                question: {
                    select: {
                        id: true,
                        question: true
                    }
                }
            },
            where: {
                teamLeadEvaluationId: id
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

export const modifyEvaluationTeamLeadCriteria = async (id: number, body: TeamLeadCriteria) => {
    try {
        const response = await prisma.teamLeadCriteria.update({
            data: {
                name: body.name,
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

export const removeEvaluationTeamLeadCriteria = async (id: number) => {
    return await prisma.teamLeadCriteria.delete({
        where: {
            id: id
        }
    })
}


//end





//criteria questions
export const getCriteriaWithQuestion = async (id: number) => {
    try {
        const criteriaWithQuestion = await prisma.teamLeadEvaluation.findMany({
            where: {
                teamLeadCriteria: {
                    some: {
                        id: id
                    }
                }
            },
            select: {
                teamLeadCriteria: {
                    where: { id: id }, // Filter to only the requested criteria
                    select: {
                        question: {
                            select: {
                                id: true,
                                question: true,
                                teamLeadCriteriaId: true
                            },
                            orderBy: {
                                id: 'asc',
                            },
                        },
                    }
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

        if (!criteriaWithQuestion) {
            throw new Error(`Criteria with id ${id} not found.`);
        }

        return {
            questions: criteriaWithQuestion.flatMap((item) =>
                item.teamLeadCriteria.flatMap((criteria) => criteria.question)
            ),
            legends: criteriaWithQuestion.flatMap((item) => item.template?.templateDetail || []),
        };
    } catch (err) {
        console.error(`Error fetching evaluation peer question for id ${id}:`, err);
        throw err;
    }
};


export const createCriteriaQuestion = async (body: Question) => {
    try {
        const response = await prisma.question.create({
            data: {
                question: body.question,
                teamLeadCriteria: {
                    connect: { id: body.teamLeadCriteriaId as number }
                }
            }
        })

        return response;
    } catch (err) {
        throw err
    }
}

export const modifyCriteriaQuestion = async (id: number, body: Question) => {
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

export const removeCriteriaQuestion = async (id: number) => {
    return await prisma.question.delete({
        where: {
            id: id
        }
    })
}


// //end peer questions


// //assign template 
export const bundleUpdateTemplateTeamLead = async (id: number, body: TeamLeadEvaluation) => {
    try {
        const response = await prisma.teamLeadEvaluation.updateMany({
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


export const assignTemplateTeamLead = async (id: number, body: TeamLeadEvaluation) => {
    try {
        const response = await prisma.teamLeadEvaluation.update({
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