import { Peer, Question, TeamLeadAssignTaskCriteria, TeamLeadCriteria, TeamLeadEvaluation } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../prisma/index.ts";


export const createEvaluationTeamLeadCategory = async (body: TeamLeadEvaluation) => {
    try {
        await checkingTeamLeadPercentage(body.evaluationId, body.percentage);

        const response = await prisma.teamLeadEvaluation.create({
            data: {
                name: body.name,
                percentage: body.percentage,
                forTeamLead: body.forTeamLead,
                evaluation: {
                    connect: { id: body.evaluationId }
                },

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
                forTeamLead: true,
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

export const getFilterCategoryByLead = async (id: number) => {
    try {
        const response = await prisma.teamLeadEvaluation.findMany({
            select: {
                id: true,
                name: true,
                percentage: true,
                forTeamLead: true,
                template: {
                    select: {
                        template_name: true
                    }
                }
            },
            where: {
                AND: [
                    {
                        evaluationId: id
                    },
                    {
                        forTeamLead: true
                    }
                ]

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
                percentage: body.percentage,
                forTeamLead: body.forTeamLead
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
                teamLeadEvaluationId: id,
                teamLeadEvaluation: {
                    forTeamLead: false
                }
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

export const getColleagueByDept = async (id: number) => {
    try {
        const response = await prisma.employees.findMany({
            select: {
                id: true,
                job: {
                    select: {
                        title: true,
                    }
                },
                information: {
                    select: {
                        first_name: true,
                        last_name: true,
                        middle_name: true,
                        photo_path: true
                    }
                },
            },
            where: {
                AND: [
                    {
                        departmentId: id
                    },
                    {
                        role: 'Employee'
                    }
                ]

            }
        })

        const serialized = response.map((item) => ({

            id: item.id,
            label: item.information?.first_name + " " + item.information?.last_name,
            suffix: item.job?.title,
            photo: item.information?.photo_path
        }))


        return serialized;
    } catch (err) {
        throw err
    }
}



//assigning criteria to colleagues
export const createCriteriaByColleague = async (body: TeamLeadAssignTaskCriteria) => {
    try {
        const response = await prisma.teamLeadAssignTaskCriteria.create({
            data: {
                name: body.name,
                employee: {
                    connect: { id: body.employeesId }
                },
                teamLead: {
                    connect: { id: body.teamLeadEvaluationId }
                }
            }
        });

        return response;
    } catch (err) {
        throw err;
    }
};


export const getCriteriaByColleague = async (evaluationId: number, employeeId: number) => {
    try {
        const response = await prisma.teamLeadAssignTaskCriteria.findMany({
            select: {
                id: true,
                name: true,
                question: {
                    select: {
                        id: true,
                        question: true
                    }
                },
            },
            where: {
                AND: [
                    {
                        teamLeadEvaluationId: evaluationId
                    },
                    {
                        employeesId: employeeId
                    }
                ]
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

export const modifyCriteriaByColleague = async (id: number, body: TeamLeadAssignTaskCriteria) => {
    try {
        const response = await prisma.teamLeadAssignTaskCriteria.update({
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

export const removeEvaluationCriteriaByColleague = async (id: number) => {
    return await prisma.teamLeadAssignTaskCriteria.delete({
        where: {
            id: id
        }
    })
}




