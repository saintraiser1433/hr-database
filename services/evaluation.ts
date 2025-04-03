import { getAdjectiveRatingFromTemplateDetail } from "../utils/adjectiveRating.ts";
import { AssignPeerEvaluations, EmployeeRating } from "../interfaces/index.ts";
import prisma from "../prisma/index.ts";
import {
  AcademicYear,
  EvaluationStatus,
  FetchType,
  PeerEvaluationResult,
  TeamLeadEvaluationResult,
} from "@prisma/client";


export const getEvaluation = async () => {
  try {
    const response = await prisma.academicYear.findMany({
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
    const response = await prisma.academicYear.findFirst({
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

export const createEvaluation = async (body: AcademicYear) => {
  try {
    const response = await prisma.academicYear.create({
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

export const modifyEvaluation = async (id: number, data: AcademicYear) => {
  try {
    if (data.status === "ONGOING") {
      // Find if there's already an ONGOING academic year that's NOT the current one being updated
      const existingOngoing = await prisma.academicYear.findFirst({
        where: {
          status: "ONGOING",
          NOT: {
            id: id
          }
        }
      });

      if (existingOngoing) {
        throw new Error(
          "There's already an academic year with ONGOING status. Please update it to COMPLETED first."
        );
      }
    }

    return await prisma.academicYear.update({
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
  return await prisma.academicYear.delete({
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
        academicYear: {
          id: deptId,
        },
      },
      orderBy: {
        forTeamLead: "desc",
      },
      include: {
        academicYear: {
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
      evaluation: {
        id: data.id,
        name: data.name,
        percentage: data.percentage,
      },
      template: data.academicYear?.teamLeadTemplate
        ? {
          name: data.academicYear?.teamLeadTemplate.template_name, // Example: "Team Lead Legend"
          details: data.academicYear?.teamLeadTemplate.templateDetail
            .map((d) => ({
              id: d.id,
              title: d.title,
              description: d.description,
              score: d.score,
            }))
            .sort((a, b) => a.score - b.score),
        }
        : null,
      questions: [
        ...data.teamLeadCriteria.flatMap((criteria) =>
          criteria.question.map((q) => ({
            categoryId: data.id,
            criteriaId: q.teamLeadCriteriaId,
            name: criteria.name,
            id: q.id,
            question: q.question,
          }))
        ),
        ...data.assignTaskCriteria.flatMap((criteria) =>
          criteria.question.map((q) => ({
            categoryId: data.id,
            criteriaId: q.assignTaskCriteriaId,
            name: criteria.name,
            id: q.id,
            question: q.question,
          }))
        ),
      ],

    }));

    return groupedResult;
  } catch (err) {
    throw err;
  }
};

export const insertTeamLeadEvaluation = async (
  body: Omit<TeamLeadEvaluationResult[], "id">,
  header: Omit<EvaluationStatus, "id">
) => {
  try {
    // Validate input data (example using a hypothetical validation function)
    if (!body || !header) {
      throw new Error("Invalid input data");
    }
    const result = await prisma.$transaction(async (tx) => {
      const headerStatus = await tx.evaluationStatus.create({
        data: header,
        select: {
          id: true,
        }
      });

      const evalData = body.map((item: any) => ({
        teamLeadEvaluationId: item.categoryId,
        questionId: item.questionId,
        templateDetailId: item.templateDetailId,
        teamLeadEvaluationStatusId: headerStatus.id
      }))

      const evaluationResults = await tx.teamLeadEvaluationResult.createMany({
        data: evalData,
      });

      return { evaluationResults };
    });

    return result;
  } catch (err) {
    throw err;
  }
};


export const getTeamLeadResults = async (filters: {
  acadId?: number;
  employeesId?: number;
} = {}
) => {
  try {

    const whereConditions = [];

    const acadId = Number(filters.acadId);
    const employeesId = Number(filters.employeesId);

    if (!isNaN(acadId)) {
      whereConditions.push({
        teamLeadEvaluationStatus: {
          academicYear: {
            id: acadId
          }
        }
      });
    }

    if (!isNaN(employeesId)) {
      whereConditions.push({
        teamLeadEvaluationStatus: {
          evaluateeId: employeesId
        }
      });
    }

    const results = await prisma.teamLeadEvaluationResult.findMany({
      where: {
        AND: whereConditions.length > 0 ? whereConditions : undefined
      },
      include: {
        teamLeadEvaluationStatus: {
          select: {
            description: true,
            evaluateeId: true,
            evaluator: {
              include: {
                information: true,
              },
            },
            academicYear: {
              select: {
                teamLeadTemplate: {
                  select: {
                    templateDetail: true
                  }
                }
              }
            },
            evaluatee: {
              include: {
                department: {
                  select: {
                    title: true,
                  }
                },
                information: true,
              },
            },
            evaluatorId: true,
          }
        },
        question: {
          include: {
            teamLeadCriteria: {
              include: {
                teamLeadEvaluation: {
                  include: {
                    academicYear: {
                      include: {
                        teamLeadTemplate: {
                          include: {
                            templateDetail: true,
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
                    academicYear: {
                      include: {
                        teamLeadTemplate: {
                          include: {
                            templateDetail: true,
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
      },
    });

    // Get all templateDetails for the evaluation
    const evaluation = results[0]?.question?.teamLeadCriteria?.teamLeadEvaluation?.academicYear ||
      results[0]?.question?.assignTaskCriteria?.teamLead?.academicYear;

    const allTemplateDetails = evaluation?.teamLeadTemplate?.templateDetail || [];

    // Extract unique rating types from templateDetails
    const ratingTypes = Array.from(new Set(allTemplateDetails.map((detail) => detail.title)));

    // Group results by employee and then by category
    const employeeRatings = results.reduce<{ [key: number]: EmployeeRating }>((acc, result) => {
      const employeeId = result.teamLeadEvaluationStatus.evaluateeId;
      const employeeName = `${result.teamLeadEvaluationStatus.evaluatee.information?.first_name} ${result.teamLeadEvaluationStatus.evaluatee.information?.last_name}`;
      const categoryName =
        result.question.teamLeadCriteria?.teamLeadEvaluation.name || // Use teamLeadEvaluation category
        result.question.assignTaskCriteria?.teamLead.name || // Use its corresponding teamLeadEvaluation category
        'Uncategorized';

      // Initialize employee entry if it doesn't exist
      if (!acc[employeeId]) {

        const templateDetail = result.teamLeadEvaluationStatus.academicYear.teamLeadTemplate?.templateDetail || [];
        acc[employeeId] = {
          employeeId,
          name: employeeName,
          answersData: [],
          template: templateDetail || [],
          departmentId: Number(result.teamLeadEvaluationStatus.evaluatee.departmentId),
          departmentName: result.teamLeadEvaluationStatus.evaluatee.department?.title,
          photo_path: result.teamLeadEvaluationStatus.evaluatee.information?.photo_path,
          rating: [],
          categoryCounts: [],
          comment: '',
          evaluatedBy: '',
        };
      }

      acc[employeeId].answersData.push({
        questionId: result.question.id,
        category: result.question.teamLeadCriteria?.teamLeadEvaluation.name ?? result.question.assignTaskCriteria?.teamLead.name ?? '',
        criteria: result.question.teamLeadCriteria?.name ?? result.question.assignTaskCriteria?.name ?? '',
        question: result.question.question,
        templateDetailId: result.templateDetail.id,
        templateDetailTitle: result.templateDetail.title,
        templateDetailScore: result.templateDetail.score,
      });

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
        ...(result.question.teamLeadCriteria?.teamLeadEvaluation.academicYear?.teamLeadTemplate?.templateDetail.map(
          (detail) => detail.score
        ) ||
          result.question.assignTaskCriteria?.teamLead.academicYear?.teamLeadTemplate?.templateDetail.map(
            (detail) => detail.score
          ) || [0])
      );

      const totalQuestionsInCategory = results.filter(
        (result) =>
          result.teamLeadEvaluationStatus.evaluateeId === employeeId &&
          (result.question.teamLeadCriteria?.teamLeadEvaluation.name === categoryName ||
            result.question.assignTaskCriteria?.teamLead.name === categoryName)
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
      const evaluationStatus = result.teamLeadEvaluationStatus;
      if (evaluationStatus) {
        const commenterName = `${evaluationStatus.evaluator.information?.first_name} ${evaluationStatus.evaluator.information?.last_name}`;
        acc[employeeId].comment = evaluationStatus.description; // Set comment
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
              result.teamLeadEvaluationStatus.evaluateeId === employee.employeeId &&
              (result.question.teamLeadCriteria?.teamLeadEvaluation.name === category.categoryName ||
                result.question.assignTaskCriteria?.teamLead.name === category.categoryName)
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


// Main service to get peer evaluation results
export const getPeerResult = async (academicYearId: number, evaluateeId: number, peerEvaluationId: number) => {
  try {
    // Fetch peer evaluation data
    const whereCondition: any = {};

    if (peerEvaluationId) {
      whereCondition.peerEvaluation = { id: peerEvaluationId };
    } else if (evaluateeId || academicYearId) {
      whereCondition.peerEvaluation = {
        ...(evaluateeId && { evaluateeId }),
        ...(academicYearId && { academicYearId }),
      };
    }

    if (academicYearId === 0) {
      return [];
    }

    const results = await prisma.peerEvaluationResult.findMany({
      where: whereCondition,
      include: {
        peerEvaluation: {
          include: {
            evaluator: {
              include: {
                information: true,
              },
            },
            evaluatee: {
              include: {
                department: {
                  select: {
                    title: true
                  }
                },
                information: true,
              },
            },
            academicYear: {
              include: {
                peerTemplate: {
                  include: {
                    templateDetail: true,
                  },
                },
              },
            }
          },
        },
        peerCategory: true,
        question: true,
        templateDetail: true,
      },
      orderBy: {
        question: {
          id: 'asc',
        },
      },
    });

    // Group results by peerEvaluationId
    const groupedResults = results.reduce<{ [key: number]: typeof results }>((acc, result) => {
      const peerEvaluationId = result.peerEvaluationId;
      if (!acc[peerEvaluationId]) {
        acc[peerEvaluationId] = [];
      }
      acc[peerEvaluationId].push(result);
      return acc;
    }, {});

    // Process each group separately
    const formattedRatings = Object.values(groupedResults).map((group) => {
      const employeeRatings = group.reduce<{ [key: number]: EmployeeRating }>((acc, result) => {
        const employeeId = result.peerEvaluation.evaluateeId;
        const employeeName = `${result.peerEvaluation.evaluatee.information?.first_name} ${result.peerEvaluation.evaluatee.information?.last_name}`;
        const categoryName = result.peerCategory.name || 'Uncategorized';

        // Initialize employee entry if it doesn't exist
        if (!acc[employeeId]) {
          acc[employeeId] = {
            peerEvalId: result.peerEvaluation.id,
            employeeId,
            name: employeeName,
            rating: [],
            template: result.peerEvaluation.academicYear.peerTemplate?.templateDetail || [],
            departmentId: Number(result.peerEvaluation.evaluatee.departmentId),
            departmentName: result.peerEvaluation.evaluatee.department?.title,
            photo_path: result.peerEvaluation.evaluatee.information?.photo_path,
            categoryCounts: [],
            comment: result.peerEvaluation.description || '',
            evaluatedBy: `${result.peerEvaluation.evaluator.information?.first_name} ${result.peerEvaluation.evaluator.information?.last_name}`,
            answersData: [],
          };
        }

        // Add question data to answersData
        acc[employeeId].answersData.push({
          questionId: result.question.id,
          category: result.peerCategory.name,
          question: result.question.question,
          templateDetailId: result.templateDetail.id,
          templateDetailTitle: result.templateDetail.title,
          templateDetailScore: result.templateDetail.score,
        });

        // Find or create the category entry
        let category = acc[employeeId].rating.find((cat) => cat.categoryName === categoryName);
        if (!category) {
          category = {
            categoryName,
            percentage: Number(result.peerCategory.percentage || 0),
            ratingPercentage: null,
            totalScore: 0,
            totalPossibleScore: 0,
            averageRating: 0,
          };
          acc[employeeId].rating.push(category);
        }

        // Update scores for the category
        category.totalScore += result.templateDetail.score;

        // Calculate total possible score: maxScoreInTemplateDetail * totalQuestionsInCategory
        const maxScoreInTemplateDetail = Math.max(
          ...(result.peerEvaluation.academicYear.peerTemplate?.templateDetail.map((detail) => detail.score) || [0]
          ));

        const totalQuestionsInCategory = group.filter(
          (result) =>
            result.peerEvaluation.evaluateeId === employeeId && result.peerCategory.name === categoryName
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
          const ratingTypes = result.peerEvaluation.academicYear.peerTemplate?.templateDetail.map((detail) => detail.title) || [];
          ratingTypes.forEach((type) => {
            templateDetailEntry![type] = 0;
          });
          acc[employeeId].categoryCounts.push(templateDetailEntry);
        }

        // Increment the count for the current rating type
        if (typeof templateDetailEntry[templateDetailTitle] === 'number') {
          templateDetailEntry[templateDetailTitle] += 1;
        }

        return acc;
      }, {});

      // Calculate total possible score and rating percentage for each category for each employee
      const employeeResults = Object.values(employeeRatings).map((employee) => {
        // Sort answersData by questionId
        employee.answersData.sort((a, b) => a.questionId - b.questionId);

        employee.rating = employee.rating
          .map((category) => {
            // Calculate rating percentage
            const ratingPercentage =
              category.totalPossibleScore > 0
                ? ((category.totalScore / category.totalPossibleScore) * 100) * category.percentage
                : null;

            // Calculate average rating for the category
            const totalQuestionsInCategory = group.filter(
              (result) =>
                result.peerEvaluation.evaluateeId === employee.employeeId && result.peerCategory.name === category.categoryName
            ).length;

            const averageRating = totalQuestionsInCategory > 0
              ? category.totalScore / totalQuestionsInCategory
              : 0;

            return {
              ...category,
              ratingPercentage: ratingPercentage !== null ? parseFloat(ratingPercentage.toFixed(2)) : null,
              averageRating: parseFloat(averageRating.toFixed(2)),
            };
          })
          .filter((category) => category.categoryName !== 'Uncategorized');

        // Calculate summary rating
        const summaryRating = employee.rating.length > 0
          ? employee.rating.reduce((sum, category) => sum + (category.averageRating || 0), 0) / employee.rating.length
          : 0;

        // Map the average summary rating to the adjectiveRating from templateDetail
        const allTemplateDetails = group[0]?.peerEvaluation.academicYear?.peerTemplate?.templateDetail || [];
        const adjectiveRating = getAdjectiveRatingFromTemplateDetail(summaryRating, allTemplateDetails);

        employee.summaryRating = {
          rating: parseFloat(summaryRating.toFixed(2)),
          adjectiveRating,
        };

        return employee;
      });

      return employeeResults;
    });

    // Flatten the grouped results into a single array
    return formattedRatings.flat();
  } catch (err) {
    throw err;
  } finally {
    await prisma.$disconnect();
  }
};




export const viewEvaluateQuestion = async (employeeId: number, acadId: number) => {
  try {
    const response = await prisma.teamLeadEvaluationResult.findMany({
      select: {
        teamLeadEvaluationId: true,
        questionId: true,
        templateDetailId: true,
        teamLeadEvaluationStatus: {
          include: {
            evaluatee: {
              include: {
                information: {
                  select: {
                    first_name: true,
                    last_name: true,
                  }
                }
              }
            },
            evaluator: {
              include: {
                information: {
                  select: {
                    first_name: true,
                    last_name: true,
                  }
                }
              }
            }
          }
        },
      },

      where: {
        AND: [
          {
            teamLeadEvaluationStatus: {
              academicYearId: acadId
            }
          },
          {
            teamLeadEvaluationStatus: {
              evaluateeId: employeeId
            }
          },
        ]

      }
    })

    const transformData = response.map((item) => ({
      evaluationId: item.teamLeadEvaluationStatus.academicYearId,
      teamLeadEvaluationId: item.teamLeadEvaluationId,
      questionId: item.questionId,
      employeesId: item.teamLeadEvaluationStatus.evaluateeId,
      templateDetailId: item.templateDetailId,
    }))
    const commenter = response[0].teamLeadEvaluationStatus.evaluator.information;
    const comment = response[0].teamLeadEvaluationStatus.description;
    const finalData = {
      transformData,
      commentsDetail: {
        comment,
        evaluatedBy: `${commenter?.first_name} ${commenter?.last_name}`
      }

    }

    return finalData;
  } catch (err) {
    throw err;
  }
}


export const viewPeerEvaluateQuestion = async (peerEvalId: number) => {
  try {
    const response = await prisma.peerEvaluationResult.findMany({
      where: {
        peerEvaluationId: peerEvalId
      },
      select: {
        questionId: true,
        templateDetailId: true,
        peerEvaluation: {
          select: {
            academicYearId: true,
            evaluateeId: true,
            evaluatorId: true,
            evaluatee: {
              include: {
                information: {
                  select: {
                    first_name: true,
                    last_name: true,
                  }
                }
              }
            },
            evaluator: {
              include: {
                information: {
                  select: {
                    first_name: true,
                    last_name: true,
                  }
                }
              }
            },
            description: true,

          },
        },
        peerCategoryId: true,
      },

    })


    const transformData = response.map((item) => ({
      evaluationId: item.peerEvaluation.academicYearId,
      teamLeadEvaluationId: item.peerCategoryId,
      questionId: item.questionId,
      employeesId: item.peerEvaluation.evaluateeId,
      templateDetailId: item.templateDetailId,
    }))
    const commenter = response[0].peerEvaluation.evaluator.information;
    const comment = response[0].peerEvaluation.description;
    const finalData = {
      transformData,
      commentsDetail: {
        comment,
        evaluatedBy: `${commenter?.first_name} ${commenter?.last_name}`
      }

    }

    return finalData;
  } catch (err) {
    throw err;
  }
}




export const assignPeerEvaluations = async (body: AssignPeerEvaluations) => {
  try {
    const department = await prisma.departments.findUnique({
      where: { id: body.departmentId },
      include: {
        employees: {
          where: { role: 'Employee' },
          orderBy: { id: 'asc' } // Consistent ordering
        },
      },
    });

    const checkEmployee = await prisma.employees.findFirst({
      where: {
        AND: [
          {
            departmentId: body.departmentId,
          },
          {
            role: 'TeamLead',
          }
        ]
      }
    })

    if (!checkEmployee) throw new Error('Please assign team lead first before shuffling');

    if (!department) throw new Error('Department not found');

    const { employees } = department;
    const employeeCount = employees.length;

    // Validate peersToEvaluate
    const peersToEvaluate = Math.max(1, Math.min(body.peersToEvaluate, employeeCount - 1));
    if (body.peersToEvaluate !== peersToEvaluate) {
      console.warn(`Adjusted peersToEvaluate from ${body.peersToEvaluate} to ${peersToEvaluate} for department size`);
    }

    // Clear existing evaluations for idempotency
    await prisma.peerEvaluation.deleteMany({
      where: {
        academicYearId: body.academicYearId,
        departmentId: body.departmentId
      }
    });

    // Prepare evaluation data for batch create
    const evaluationData = [];

    for (let i = 0; i < employeeCount; i++) {
      const evaluator = employees[i];

      // Select next N peers in circular manner
      for (let j = 1; j <= peersToEvaluate; j++) {
        const peerIndex = (i + j) % employeeCount;
        if (peerIndex !== i) { // Skip self-evaluation
          evaluationData.push({
            academicYearId: body.academicYearId,
            evaluatorId: evaluator.id,
            evaluateeId: employees[peerIndex].id,
            departmentId: body.departmentId,
          });
        }
      }
    }

    // Batch create all evaluations at once
    await prisma.peerEvaluation.createMany({
      data: evaluationData,
      skipDuplicates: true
    });

    return viewPeerEvaluations(body.academicYearId, body.departmentId);
  } catch (err) {
    console.error('Error in assignPeerEvaluations:', err);
    throw err;
  }
};






export const viewPeerEvaluations = async (academicYearId: number, departmentId: number) => {
  try {
    const response = await prisma.peerEvaluation.findMany({
      select: {
        evaluator: {
          select: {
            information: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        evaluatee: {
          select: {
            information: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
      where: {
        AND: [
          { academicYearId: academicYearId },
          { departmentId: departmentId },
        ],
      },
    });

    // Group evaluations by evaluator
    const groupedData = response.reduce((acc, item) => {
      const evaluator = `${item.evaluator.information?.first_name} ${item.evaluator.information?.last_name}`;
      const evaluate = `${item.evaluatee.information?.first_name} ${item.evaluatee.information?.last_name}`;

      if (!acc[evaluator]) {
        acc[evaluator] = [];
      }
      acc[evaluator].push(evaluate);
      return acc;
    }, {} as Record<string, string[]>);

    // Transform grouped data into the desired format
    const transformData = Object.entries(groupedData).map(([evaluator, evaluatees]) => {
      const result: Record<string, string> = { evaluator };
      evaluatees.forEach((evaluate, index) => {
        result[`evaluate${index + 1}`] = evaluate;
      });
      return result;
    });

    return transformData;
  } catch (err) {
    throw err;
  }
};




export const getPeerEvaluateeByEmpId = async (id: number) => {
  try {
    const result = await prisma.peerEvaluation.findMany({
      select: {
        id: true,
        evaluatee: {
          select: {
            id: true,

            information: {
              select: {
                first_name: true,
                last_name: true,
                photo_path: true,
              }
            },
            department: {
              select: {
                title: true,
              }
            },
            createdAt: true,
            job: {
              select: {
                title: true
              }
            },

          }
        },
        status: true,
      },
      where: {
        evaluatorId: id,
      }
    })

    const transformData = result.map((item) => {
      const evaluatee = `${item.evaluatee.information?.first_name} ${item.evaluatee.information?.last_name}`;
      return {
        id: item.id,
        employeeId: item.evaluatee.id,
        department: item.evaluatee.department?.title,
        hiredDate: item.evaluatee.createdAt,
        job: item.evaluatee.job?.title,
        evaluatee,
        photo_path: item.evaluatee.information?.photo_path,
        isFinishedPeerEvaluate: item.status
      }
    })
    return transformData;
  } catch (err) {
    throw err;
  }
}


export const insertPeerEvaluationResult = async (
  body: Omit<PeerEvaluationResult, "id">,
  peerEvalId: number,
  description: string,
) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const evaluationResults = await tx.peerEvaluationResult.createMany({
        data: body,
      });

      const peerStatus = await tx.peerEvaluation.update({
        where: {
          id: peerEvalId,
        },
        data: {
          status: true,
          description: description
        }
      })

      return { evaluationResults, peerStatus };
    });

    return result;
  } catch (err) {
    throw err;
  }
};


export const getPeerCategoryQuestion = async (academicYearId: number) => {
  try {
    const academicYearData = await prisma.academicYear.findUnique({
      where: {
        id: academicYearId,
      },
      include: {
        peer: {
          include: {
            question: {
              select: {
                id: true,
                question: true
              }
            }, // Include all questions for each peer category
          },
        },
        peerTemplate: {
          include: {
            templateDetail: true, // Include all template details for the template header
          },
        },
      },
    });

    if (!academicYearData) {
      throw new Error("Academic year not found");
    }

    // Transform the data into the desired structure
    return academicYearData.peer.map((category) => ({
      evaluation: {
        id: category.id,
        name: category.name,
        percentage: category.percentage,
      },
      template: {
        name: academicYearData.peerTemplate?.template_name || "",
        details: academicYearData.peerTemplate?.templateDetail || [],
      },

      questions: category.question.map((item) => ({
        id: item.id,
        categoryId: category.id,
        name: category.name,
        question: item.question,
      })),


    }))



  } catch (err) {
    throw err;
  }
};


export const getEmployeeEvaluateeStatus = async (deptId: number, empId: number | null | undefined, academicYearId: number) => {
  try {
    const teamLeadEmployees = await prisma.employees.findMany({
      select: {
        id: true,
        role: true,
        department: true,
        createdAt: true,
        job: {
          select: {
            title: true,
          }
        },

        information: {
          select: {
            first_name: true,
            last_name: true,
            photo_path: true,
          },
        },
        evaluatee: {
          where: {
            academicYearId: academicYearId,
          },
          select: {
            status: true, // Include status to check if evaluation is completed
          },
        },
        teamLeadEvaluatee: {
          where: {
            academicYearId: academicYearId,
          },
        },
      },
      where: {
        AND: [
          { departmentId: deptId },

          { role: 'Employee' },
          ...(empId ? [{ id: empId }] : []),
        ]

      },
    });

    const result = teamLeadEmployees.map((employee) => {
      // Calculate peer evaluation progress
      const totalPeerEvaluations = employee.evaluatee.length; // Total evaluations
      const completedPeerEvaluations = employee.evaluatee.filter((evaluation) => evaluation.status).length; // Completed evaluations

      // Format peerToEvaluate
      const peerToEvaluate =
        totalPeerEvaluations === 0 ? false : `${completedPeerEvaluations}/${totalPeerEvaluations}`;

      // Determine if all peer evaluations are completed
      const isFinishedPeerEvaluate = totalPeerEvaluations > 0 && completedPeerEvaluations === totalPeerEvaluations;

      return {
        employeeId: employee.id,
        department: employee.department?.title,
        hiredDate: employee.createdAt,
        job: employee.job?.title,
        photo_path: employee.information?.photo_path,
        evaluatee: `${employee.information?.first_name} ${employee.information?.last_name}`,
        role: employee.role,
        peerToEvaluate, // Format: "completed/total" or false if 0/0
        isFinishedPeerEvaluate, // True if all evaluations are completed
        isEvaluatedByTeamLead: employee.teamLeadEvaluatee.some((item) => item.type === "TeamLead"),
      };
    });

    return result;
  } catch (err) {
    throw err
  }

} 