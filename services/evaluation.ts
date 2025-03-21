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
import { shuffleArray } from "../utils/shuffleArray.ts";

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
    const checkDuplicateStatus = await prisma.academicYear.findMany({
      where: {
        status: "ONGOING",
      },
    });
    if (checkDuplicateStatus.length > 1) {
      throw new Error(
        "Please update the ongoing status to finished before update"
      );
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


export const getTeamLeadResults = async (acadId: number, employeesId: number) => {
  try {
    const results = await prisma.teamLeadEvaluationResult.findMany({
      where: {
        AND: [
          {
            teamLeadEvaluationStatus: {
              academicYearId: acadId
            },
          },
          {
            teamLeadEvaluationStatus: {
              evaluateeId: employeesId
            },
          },
        ],
      },
      include: {
        teamLeadEvaluationStatus: {
          select: {
            description: true,
            evaluateeId: true,
            evaluator: {
              include: {
                information: true, // Include commenter's information to get their name
              },
            },
            evaluatee: {
              include: {
                information: true, // Include commenter's information to get their name
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
                            templateDetail: true, // Include templateDetail to get the adjectiveRating
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
    } 
   
    else if (evaluateeId || academicYearId) {
      whereCondition.peerEvaluation = {
        ...(evaluateeId && { evaluateeId }), 
        ...(academicYearId && { academicYearId }),
      };
    }

    const results = await prisma.peerEvaluationResult.findMany({
      where: whereCondition,
      include: {
        peerEvaluation: {
          include: {
            evaluator: {
              include: {
                information: true, // Include evaluator details (first_name, last_name)
              },
            },
            evaluatee: {
              include: {
                information: true, // Include evaluatee details (first_name, last_name)
              },
            },
            academicYear: {
              include: {
                peerTemplate: {
                  include: {
                    templateDetail: true, // Include template details for adjective rating
                  },
                },
              },
            }

          },
        },
        peerCategory: true, // Include peer category details
        question: true, // Include question details
        templateDetail: true, // Include template detail (title and score)

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
      // Initialize employee ratings for this group
      const employeeRatings = group.reduce<{ [key: number]: EmployeeRating }>((acc, result) => {
        const employeeId = result.peerEvaluation.evaluateeId;
        const employeeName = `${result.peerEvaluation.evaluatee.information?.first_name} ${result.peerEvaluation.evaluatee.information?.last_name}`;
        const categoryName = result.peerCategory.name || 'Uncategorized';

        // Initialize employee entry if it doesn't exist
        if (!acc[employeeId]) {
          acc[employeeId] = {
            employeeId,
            name: employeeName,
            rating: [],
            categoryCounts: [], // Initialize categoryCounts
            comment: result.peerEvaluation.description || '', // Set comment from PeerEvaluation
            evaluatedBy: `${result.peerEvaluation.evaluator.information?.first_name} ${result.peerEvaluation.evaluator.information?.last_name}`, // Set evaluatedBy
          };
        }

        // Find or create the category entry
        let category = acc[employeeId].rating.find((cat) => cat.categoryName === categoryName);
        if (!category) {
          category = {
            categoryName,
            percentage: Number(result.peerCategory.percentage || 0),
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
        const allTemplateDetails = group[0]?.peerEvaluation.academicYear?.peerTemplate?.templateDetail || [];
        const adjectiveRating = getAdjectiveRatingFromTemplateDetail(averageSummaryRating, allTemplateDetails);

        employee.summaryRating = {
          rating: parseFloat(averageSummaryRating.toFixed(2)), // Round to 2 decimal places
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

export const assignPeerEvaluations = async (body: AssignPeerEvaluations) => {
  try {
    const departments = await prisma.departments.findMany({
      where: {
        id: body.departmentId,
      },
      include: {
        employees: {
          where: {
            role: 'Employee',
          },
        },
      },
    });

    for (const department of departments) {
      const employees = department.employees;

      // Calculate the maximum allowed peersToEvaluate
      const maxPeersToEvaluate = employees.length - 1; // An employee cannot evaluate themselves

      // Check if the provided peersToEvaluate is valid
      if (body.peersToEvaluate > maxPeersToEvaluate) {
        throw new Error(
          `Invalid peers to evaluate: ${body.peersToEvaluate}. ` +
          `The maximum allowed value for this department is ${maxPeersToEvaluate}.`
        );
      }

      const evaluatedPairs = new Set<string>(); // Track evaluator-evaluatee pairs
      const evaluationCountMap = new Map<number, number>(); // Track how many times each employee has been evaluated

      // Initialize evaluation count for each employee
      for (const emp of employees) {
        evaluationCountMap.set(emp.id, 0);
      }

      for (const evaluator of employees) {
        // Get all peers except the evaluator
        const peers = employees.filter((emp) => emp.id !== evaluator.id);

        // Filter out peers that have already been evaluated by this evaluator in this academic year
        const availablePeers = peers.filter((peer) => {
          const pairKey = `${body.academicYearId}-${evaluator.id}-${peer.id}`;
          return !evaluatedPairs.has(pairKey);
        });

        // Sort peers by evaluation count (to balance the distribution)
        const sortedPeers = availablePeers.sort((a, b) => {
          const countA = evaluationCountMap.get(a.id)!;
          const countB = evaluationCountMap.get(b.id)!;
          return countA - countB; // Prefer peers with fewer evaluations
        });

        // Randomly select peers
        const selectedPeers =
          sortedPeers.length <= body.peersToEvaluate
            ? sortedPeers // Evaluate all available peers if there are not enough
            : shuffleArray(sortedPeers).slice(0, body.peersToEvaluate); // Randomly select peers

        // Create evaluation records
        for (const peer of selectedPeers) {
          await prisma.peerEvaluation.create({
            data: {
              academicYearId: body.academicYearId,
              evaluatorId: evaluator.id,
              evaluateeId: peer.id,
              departmentId: body.departmentId,
            },
          });

          // Mark this pair as evaluated for this academic year
          const pairKey = `${body.academicYearId}-${evaluator.id}-${peer.id}`;
          evaluatedPairs.add(pairKey);

          // Update the evaluation count for the peer
          evaluationCountMap.set(peer.id, evaluationCountMap.get(peer.id)! + 1);
        }
      }
    }
    return viewPeerEvaluations(body.academicYearId, body.departmentId)
  } catch (err) {
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
            }
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


export const getEmployeeEvaluateeStatus = async (deptId: number, academicYearId: number) => {
  try {
    const teamLeadEmployees = await prisma.employees.findMany({
      select: {
        id: true,
        role: true,
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
        id: employee.id,
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