import { EmployeeRating } from "../interfaces/index.ts";
import prisma from "../prisma/index.ts";
import {
  Evaluation,
  EvaluationStatus,
  TeamLeadEvaluationResult,
} from "@prisma/client";

export const getEvaluation = async () => {
  try {
    const response = await prisma.evaluation.findMany({
      select: {
        id: true,
        school_year: true,
        semester: true,
        status: true,
        peerTemplateId: true,
        teamLeadTemplateId: true,
        teamLeadTemplate: {
          select: {
            template_name: true
          }
        },
        peerTemplate: {
          select: {
            template_name: true
          }
        }
      },
      orderBy: [
        {
          school_year: "asc",
        },
        {
          semester: "asc",
        },
      ],
    });

    return response;
  } catch (err) {
    throw err;
  }
};




export const getEvaluationOngoing = async () => {
  try {
    const response = await prisma.evaluation.findFirst({
      select: {
        id: true,
        school_year: true,
        semester: true,
        status: true,
        peerTemplateId: true,
        teamLeadTemplateId: true,
      },
      where: {
        status: "ONGOING",
      },
      orderBy: [
        {
          school_year: "asc",
        },
        {
          semester: "asc",
        },
      ],
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const createEvaluation = async (body: Evaluation) => {
  try {
    const response = await prisma.evaluation.create({
      select: {
        id: true,
        school_year: true,
        semester: true,
        status: true,
        peerTemplate: {
          select: {
            template_name: true,
          }
        },
        teamLeadTemplate: {
          select: {
            template_name: true,
          }
        },
        peerTemplateId: true,
        teamLeadTemplateId: true,

      },
      data: body,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const modifyEvaluation = async (id: number, data: Evaluation) => {
  try {
    const checkDuplicateStatus = await prisma.evaluation.findMany({
      where: {
        status: "ONGOING",
      },
    });
    if (checkDuplicateStatus.length > 1) {
      throw new Error(
        "Please update the ongoing status to finished before update"
      );
    }

    return await prisma.evaluation.update({
      select: {
        id: true,
        school_year: true,
        semester: true,
        status: true,
        peerTemplate: {
          select: {
            template_name: true,
          }
        },
        teamLeadTemplate: {
          select: {
            template_name: true,
          }
        },
        peerTemplateId: true,
        teamLeadTemplateId: true,

      },
      where: {
        id: id,
      },
      data,
    });
  } catch (err) {
    throw err;
  }
};

export const removeEvaluation = async (id: number) => {
  return await prisma.evaluation.delete({
    where: {
      id: id,
    },
  });
};

export const getEvaluationEmployeeCriteria = async (
  employeeId: number,
  deptId: number
) => {
  try {
    // Get all TeamLeadEvaluation related to the department
    const teamLeadEvaluations = await prisma.teamLeadEvaluation.findMany({
      where: {
        evaluation: {
          id: deptId,
        },
      },
      orderBy: {
        forTeamLead: "desc",
      },
      include: {
        evaluation: {
          include: {
            teamLeadTemplate: {
              include: {
                templateDetail: true,
              },
            },
          },
        },
        teamLeadCriteria: {
          where: {
            teamLeadEvaluation: {
              forTeamLead: false,
            },
          },
          include: {
            question: true,
            teamLeadEvaluation: true,
          },
        },
        assignTaskCriteria: {
          where: {
            employeesId: employeeId,
          },
          include: {
            question: true,
          },
        },
      },
    });

    // Format the result
    const groupedResult = teamLeadEvaluations.map((data) => ({
      teamLeadEvaluation: {
        id: data.id,
        name: data.name,
        percentage: data.percentage,
      },
      template: data.evaluation?.teamLeadTemplate
        ? {
          name: data.evaluation?.teamLeadTemplate.template_name, // Example: "Team Lead Legend"
          details: data.evaluation?.teamLeadTemplate.templateDetail
            .map((d) => ({
              id: d.id,
              title: d.title,
              description: d.description,
              score: d.score,
            }))
            .sort((a, b) => a.score - b.score),
        }
        : null,
      criteria: [
        ...data.teamLeadCriteria.map((criteria) => ({
          questions: criteria.question.map((q) => ({
            categoryId: data.id,
            criteriaId: q.teamLeadCriteriaId,
            name: criteria.name,
            id: q.id,
            question: q.question,
          })),
        })),
        ...data.assignTaskCriteria.map((criteria) => ({
          questions: criteria.question.map((q) => ({
            categoryId: data.id,
            criteriaId: q.assignTaskCriteriaId,
            name: criteria.name,
            id: q.id,
            question: q.question,
          })),
        })),
      ],
    }));

    return groupedResult;
  } catch (err) {
    throw err;
  }
};

export const insertTeamLeadEvaluation = async (
  body: Omit<TeamLeadEvaluationResult, "id">,
  header: Omit<EvaluationStatus, "id">
) => {
  try {
    // Validate input data (example using a hypothetical validation function)
    if (!body || !header) {
      throw new Error("Invalid input data");
    }
    const result = await prisma.$transaction(async (tx) => {
      const evaluationResults = await tx.teamLeadEvaluationResult.createMany({
        data: body,
      });
      const headerStatus = await tx.evaluationStatus.create({
        data: header,
      });
      return { evaluationResults, headerStatus };
    });

    return result;
  } catch (err) {
    throw err;
  }
};


export const getTeamLeadResults = async (evaluationId: number, employeesId: number) => {
  try {
    const results = await prisma.teamLeadEvaluationResult.findMany({
      where: {
        AND: [
          {
            evaluationId: evaluationId,
          },
          {
            employeesId: employeesId,
          },
        ],
      },
      include: {
        question: {
          include: {
            teamLeadCriteria: {
              include: {
                teamLeadEvaluation: {
                  include: {
                    evaluation: {
                      include: {
                        teamLeadTemplate: {
                          include: {
                            templateDetail: true, // Include templateDetail to get the adjectiveRating
                          },
                        },
                        evaluationStatus: {
                          include: {
                            commenter: {
                              include: {
                                information: true, // Include commenter's information to get their name
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            assignTaskCriteria: {
              include: {
                teamLead: {
                  include: {
                    evaluation: {
                      include: {
                        teamLeadTemplate: {
                          include: {
                            templateDetail: true, // Include templateDetail to get the adjectiveRating
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        templateDetail: true,
        employee: {
          include: {
            information: true,
          },
        },
      },
    });

    // Get all templateDetails for the evaluation
    const evaluation = results[0]?.question?.teamLeadCriteria?.teamLeadEvaluation?.evaluation ||
      results[0]?.question?.assignTaskCriteria?.teamLead?.evaluation;

    const allTemplateDetails = evaluation?.teamLeadTemplate?.templateDetail || [];

    // Extract unique rating types from templateDetails
    const ratingTypes = Array.from(new Set(allTemplateDetails.map((detail) => detail.title)));

    // Group results by employee and then by category
    const employeeRatings = results.reduce<{ [key: number]: EmployeeRating }>((acc, result) => {
      const employeeId = result.employeesId;
      const employeeName = `${result.employee.information?.first_name} ${result.employee.information?.last_name}`;
      const categoryName =
        result.question.teamLeadCriteria?.teamLeadEvaluation.name ||
        result.question.assignTaskCriteria?.name ||
        'Uncategorized';

      // Initialize employee entry if it doesn't exist
      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          name: employeeName,
          rating: [],
          categoryCounts: [], // Initialize categoryCounts
          comment: '', // Initialize comment
          evaluatedBy: '', // Initialize evaluatedBy
        };
      }

      // Find or create the category entry
      let category = acc[employeeId].rating.find((cat) => cat.categoryName === categoryName);
      if (!category) {
        category = {
          categoryName,
          percentage: Number(
            result.question.teamLeadCriteria?.teamLeadEvaluation.percentage ||
            result.question.assignTaskCriteria?.teamLead.percentage ||
            0
          ),
          ratingPercentage: null,
          totalScore: 0,
          totalPossibleScore: 0,
        };
        acc[employeeId].rating.push(category);
      }

      // Update scores for the category
      category.totalScore += result.templateDetail.score;

      // Calculate total possible score: maxScoreInTemplateDetail * totalQuestionsInCategory
      const maxScoreInTemplateDetail = Math.max(
        ...(result.question.teamLeadCriteria?.teamLeadEvaluation.evaluation?.teamLeadTemplate?.templateDetail.map(
          (detail) => detail.score
        ) ||
          result.question.assignTaskCriteria?.teamLead.evaluation?.teamLeadTemplate?.templateDetail.map(
            (detail) => detail.score
          ) || [0])
      );

      const totalQuestionsInCategory = results.filter(
        (result) =>
          result.employeesId === employeeId &&
          (result.question.teamLeadCriteria?.teamLeadEvaluation.name === categoryName ||
            result.question.assignTaskCriteria?.name === categoryName)
      ).length;

      category.totalPossibleScore = maxScoreInTemplateDetail * totalQuestionsInCategory;

      // Update templateDetail counts
      const templateDetailTitle = result.templateDetail.title;
      let templateDetailEntry = acc[employeeId].categoryCounts.find((cat) => cat.Category === categoryName);

      if (!templateDetailEntry) {
        // Initialize the category with default counts for all rating types
        templateDetailEntry = {
          Category: categoryName,
        };
        // Initialize all rating types to 0
        ratingTypes.forEach((type) => {
          templateDetailEntry![type] = 0;
        });
        acc[employeeId].categoryCounts.push(templateDetailEntry);
      }

      // Increment the count for the current rating type
      if (typeof templateDetailEntry[templateDetailTitle] === 'number') {
        templateDetailEntry[templateDetailTitle] += 1;
      }

      // Update comment and evaluatedBy from EvaluationStatus
      const evaluationStatus = result.question.teamLeadCriteria?.teamLeadEvaluation?.evaluation?.evaluationStatus;
      if (evaluationStatus && evaluationStatus.length > 0) {
        const commenterName = `${evaluationStatus[0].commenter.information?.first_name} ${evaluationStatus[0].commenter.information?.last_name}`;
        acc[employeeId].comment = evaluationStatus[0].description; // Set comment
        acc[employeeId].evaluatedBy = commenterName; // Set evaluatedBy
      }

      return acc;
    }, {});

    // Calculate total possible score and rating percentage for each category for each employee
    const formattedRatings = Object.values(employeeRatings).map((employee) => {
      employee.rating = employee.rating
        .map((category) => {
          // Calculate rating percentage
          const ratingPercentage =
            category.totalPossibleScore > 0
              ? ((category.totalScore / category.totalPossibleScore) * 100) * category.percentage
              : null;

          // Calculate average rating for the category
          const totalQuestionsInCategory = results.filter(
            (result) =>
              result.employeesId === employee.employeeId &&
              (result.question.teamLeadCriteria?.teamLeadEvaluation.name === category.categoryName ||
                result.question.assignTaskCriteria?.name === category.categoryName)
          ).length;

          const averageRating = category.totalScore / totalQuestionsInCategory;

          return {
            ...category,
            ratingPercentage: ratingPercentage !== null ? parseFloat(ratingPercentage.toFixed(2)) : null,
            averageRating: parseFloat(averageRating.toFixed(2)),
          };
        })
        .filter((category) => category.categoryName !== 'Uncategorized');

      // Calculate summary rating
      const summaryRating = employee.rating.reduce((sum, category) => sum + (category.averageRating || 0), 0);

      // Divide the summary rating by the number of categories to get the average
      const numberOfCategories = employee.rating.length;
      const averageSummaryRating = summaryRating / numberOfCategories;

      // Map the average summary rating to the adjectiveRating from templateDetail
      const adjectiveRating = getAdjectiveRatingFromTemplateDetail(averageSummaryRating, allTemplateDetails);

      employee.summaryRating = {
        rating: parseFloat(averageSummaryRating.toFixed(2)), // Round to 2 decimal places
        adjectiveRating,
      };

      return employee;
    });

    return formattedRatings;
  } catch (err) {
    throw err;
  }
};

const getAdjectiveRatingFromTemplateDetail = (rating: number, templateDetails: any[]): string => {
  const sortedTemplateDetails = templateDetails.sort((a, b) => b.score - a.score);
  const templateDetail = sortedTemplateDetails.find((detail) => rating >= detail.score);
  return templateDetail?.title || 'Unknown';
};