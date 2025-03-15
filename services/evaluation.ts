import prisma from '../prisma/index.ts';
import { Comments, Evaluation, TeamLeadEvaluationResult } from '@prisma/client';

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

export const getEvaluationOngoing = async () => {
    try {
        const response = await prisma.evaluation.findFirst({
            select: {
                id: true,
                school_year: true,
                semester: true,
                status: true
            },
            where: {
                status: 'ONGOING'
            },
            orderBy: [
                {
                    school_year: 'asc',
                },
                {
                    semester: 'asc'
                },

            ],

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

export const getEvaluationEmployeeCriteria = async (employeeId: number, deptId: number) => {
    try {
        // Get all TeamLeadEvaluation related to the department
        const teamLeadEvaluations = await prisma.teamLeadEvaluation.findMany({
            where: {
                evaluation: {
                    id: deptId
                },

            },
            orderBy: {
                forTeamLead: 'desc',
            },
            include: {
                template: {
                    include: {
                        templateDetail: true
                    },
                },
                teamLeadCriteria: {
                    where: {
                        teamLeadEvaluation: {
                            forTeamLead: false
                        }
                    },
                    include: {
                        question: true,
                        teamLeadEvaluation: true
                    }
                },
                assignTaskCriteria: {
                    where: {
                        employeesId: employeeId
                    },
                    include: {
                        question: true
                    }
                }
            }
        });

        // Format the result
        const groupedResult = teamLeadEvaluations.map((evaluation) => ({
            teamLeadEvaluation: {
                id: evaluation.id,
                name: evaluation.name,
                percentage: evaluation.percentage,
            },
            template: evaluation.template
                ? {
                    name: evaluation.template.template_name, // Example: "Team Lead Legend"
                    details: evaluation.template.templateDetail.map(d => ({
                        id: d.id,
                        title: d.title,
                        description: d.description,
                        score: d.score
                    })).sort((a, b) => a.score - b.score)
                }
                : null,
            criteria: [
                ...evaluation.teamLeadCriteria.map(criteria => ({
                    questions: criteria.question.map(q => ({
                        categoryId: evaluation.id,
                        criteriaId: q.teamLeadCriteriaId,
                        name: criteria.name,
                        id: q.id,
                        question: q.question
                    }))
                })),
                ...evaluation.assignTaskCriteria.map(criteria => ({
                    questions: criteria.question.map(q => ({
                        categoryId: evaluation.id,
                        criteriaId: q.assignTaskCriteriaId,
                        name: criteria.name,
                        id: q.id,
                        question: q.question
                    }))
                }))
            ]
        }));

        return groupedResult;
    } catch (err) {
        throw err;
    }
};


export const insertTeamLeadEvaluation = async (
    body: TeamLeadEvaluationResult,
    commentsBody: Comments
) => {
    try {
        // Validate input data (example using a hypothetical validation function)
        if (!body || !commentsBody) {
            throw new Error('Invalid input data');
        }

        // Perform the transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create team lead evaluation results
            const evaluationResults = await tx.teamLeadEvaluationResult.createMany({
                data: body,
            });

            // Create comments
            const comments = await tx.comments.create({
                data: commentsBody,
            });

            // Return the results
            return { evaluationResults, comments };
        });

        return result;
    } catch (err) {
        throw err;
    }
};




