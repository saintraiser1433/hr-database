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
interface EmployeeRating {
  employeeId: number; // Add employeeId to the interface
  name: string;
  rating: {
    categoryName: string;
    percentage: number;
    ratingPercentage: number | null;
    totalScore: number;
    totalPossibleScore: number;
    averageScore: number;
  }[];
  summary: {
    summaryRating: number;
    remarks: string;
  };
}
export const getTeamLeadResults = async (evaluationId: number) => {
  try {
    const results = await prisma.teamLeadEvaluationResult.findMany({
      where: { evaluationId: evaluationId },
      select: {
        employeesId: true,
        employee:{
            select:{
                information:{
                    select:{
                        first_name:true,
                        last_name:true,
                    }
                }
            }
        },
        templateDetail: { select: { score: true } },
        question: {
          select: {
            teamLeadCriteria: {
              select: {

                teamLeadEvaluation: {
                  select: { name: true, percentage: true,evaluation:{
                    select:{
                        teamLeadTemplate:{
                            select:{
                                templateDetail:{
                                    select:{
                                        score:true,
                                        title:true

                                    }
                                }
                            }
                        }
                    }
                  } },
                },
              },
            },
            assignTaskCriteria: {
              select: {
                name: true,
                teamLead: { select: { percentage: true } },
              },
            },
          },
        },
      },
    });

    const employeeMap = new Map<number, EmployeeRating>();

    results.forEach((result) => {
      if (!employeeMap.has(result.employeesId)) {
        employeeMap.set(result.employeesId, {
          employeeId: result.employeesId,
          name: `${result.employee.information?.first_name} ${result.employee.information?.last_name}`,
          rating: [],
          summary: { summaryRating: 0, remarks: "" },
        });
      }

      const categoryName =
        result.question.teamLeadCriteria?.teamLeadEvaluation.name ||
        result.question.assignTaskCriteria?.name ||
        "Uncategorized";

      const employee = employeeMap.get(result.employeesId)!;
      let category = employee.rating.find(
        (cat) => cat.categoryName === categoryName
      );
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
          averageScore: 0,
        };
        employee.rating.push(category);
      }

      category.totalScore += result.templateDetail.score;
      category.totalPossibleScore = result.templateDetail.score;
    });

    const formattedRatings = Array.from(employeeMap.values()).map(
      (employee) => {
        employee.rating = employee.rating
          .map((category) => {
            const totalQuestionsInCategory = results.filter(
              (result) =>
                result.employeesId === employee.employeeId &&
                (result.question.teamLeadCriteria?.teamLeadEvaluation.name ===
                  category.categoryName ||
                  result.question.assignTaskCriteria?.name ===
                    category.categoryName)
            ).length;

            const maxScoreInTemplateDetail = Math.max(
              ...results
                .filter(
                  (result) =>
                    result.employeesId === employee.employeeId &&
                    (result.question.teamLeadCriteria?.teamLeadEvaluation
                      .name === category.categoryName ||
                      result.question.assignTaskCriteria?.name ===
                        category.categoryName)
                )
                .map((result) => result.templateDetail.score)
            );

            category.totalPossibleScore =
              maxScoreInTemplateDetail * totalQuestionsInCategory;
            category.averageScore =
              category.totalScore / totalQuestionsInCategory;

            const ratingPercentage =
              category.totalPossibleScore > 0
                ? (category.totalScore / category.totalPossibleScore) *
                  100 *
                  category.percentage
                : null;

            return {
              ...category,
              ratingPercentage:
                ratingPercentage !== null
                  ? parseFloat(ratingPercentage.toFixed(2))
                  : null,
              averageScore: parseFloat(category.averageScore.toFixed(2)),
            };
          })
          .filter((category) => category.categoryName !== "Uncategorized");

        const totalAverageScores = employee.rating.reduce(
          (sum, category) => sum + category.averageScore,
          0
        );
        const totalCategories = employee.rating.length;
        const summaryRating = totalAverageScores / totalCategories;

        const templateDetails =
          results[0]?.question.teamLeadCriteria?.teamLeadEvaluation.evaluation?.teamLeadTemplate?.templateDetail || [];
        const sortedTemplateDetails = templateDetails.sort(
          (a, b) => a.score - b.score
        );

        let remarks = "Unclassified";
        for (const detail of sortedTemplateDetails) {
          if (summaryRating >= detail.score) {
            remarks = detail.title;
          }
        }

        employee.summary = {
          summaryRating: parseFloat(summaryRating.toFixed(2)),
          remarks,
        };

        return employee;
      }
    );

    return formattedRatings;
  } catch (err) {
    throw err;
  }
};
