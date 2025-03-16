import { Question } from "@prisma/client";
import prisma from "../prisma/index.ts";

//criteria questions
export const getCriteriaWithQuestion = async (id: number) => {
  try {
    const criteriaWithQuestion = await prisma.teamLeadEvaluation.findMany({
      where: {
        AND: [
          {
            forTeamLead: false,
          },
          {
            teamLeadCriteria: {
              some: {
                id: id,
              },
            },
          },
        ],
      },
      select: {
        teamLeadCriteria: {
          where: { id: id }, // Filter to only the requested criteria
          select: {
            question: {
              select: {
                id: true,
                question: true,
                teamLeadCriteriaId: true,
              },
              orderBy: {
                id: "asc",
              },
            },
          },
        },
        evaluation: {
          select: {
            teamLeadTemplate: {
              select: {
                templateDetail: {
                  select: {
                    title: true,
                    score: true,
                  },
                  orderBy: {
                    score: "asc",
                  },
                },
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
      legends: criteriaWithQuestion.flatMap(
        (item) => item.evaluation?.teamLeadTemplate?.templateDetail || []
      ),
    };
  } catch (err) {
    console.error(`Error fetching evaluation peer question for id ${id}:`, err);
    throw err;
  }
};

export const getCustomCriteriaWithQuestion = async (id: number) => {
  try {
    const criteriaWithQuestion = await prisma.teamLeadEvaluation.findMany({
      where: {
        AND: [
          {
            forTeamLead: true,
          },
          {
            assignTaskCriteria: {
              some: {
                id: id,
              },
            },
          },
        ],
      },
      select: {
        assignTaskCriteria: {
          where: { id: id }, // Filter to only the requested criteria
          select: {
            question: {
              select: {
                id: true,
                question: true,
                teamLeadCriteriaId: true,
              },
              orderBy: {
                id: "asc",
              },
            },
          },
        },
        evaluation: {
          select: {
            teamLeadTemplate: {
              select: {
                templateDetail: {
                  select: {
                    title: true,
                    score: true,
                  },
                  orderBy: {
                    score: "asc",
                  },
                },
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
        item.assignTaskCriteria.flatMap((criteria) => criteria.question)
      ),
      legends: criteriaWithQuestion.flatMap(
        (item) => item.evaluation?.teamLeadTemplate?.templateDetail || []
      ),
    };
  } catch (err) {
    console.error(`Error fetching evaluation peer question for id ${id}:`, err);
    throw err;
  }
};

export const getPeerCriteriaQuestion = async (id: number) => {
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
            id: "asc",
          },
        },
        evaluation: {
          select: {
            teamLeadTemplate: {
              select: {
                templateDetail: {
                  select: {
                    title: true,
                    score: true,
                  },
                  orderBy: {
                    score: "asc",
                  },
                },
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
      legends: peerWithQuestions.evaluation?.teamLeadTemplate?.templateDetail || [],
    };
  } catch (err) {
    console.error(`Error fetching evaluation peer question for id ${id}:`, err);
    throw err;
  }
};

export const createCriteriaQuestion = async (
  body: Question,
  type: "Peer" | "TeamLead" | "Custom"
) => {
  try {
    let data: any = {
      question: body.question,
    };

    if (type === "TeamLead") {
      data.teamLeadCriteria = {
        connect: { id: body.teamLeadCriteriaId as number },
      };
    } else if (type === "Peer") {
      data.peer = {
        connect: { id: body.peerId as number },
      };
    } else if (type === "Custom") {
      data.assignTaskCriteria = {
        connect: { id: body.assignTaskCriteriaId as number },
      };
    }

    const response = await prisma.question.create({
      data,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const modifyCriteriaQuestion = async (id: number, body: Question) => {
  try {
    const response = await prisma.question.update({
      data: {
        question: body.question,
      },
      where: {
        id: id,
      },
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const removeCriteriaQuestion = async (id: number) => {
  return await prisma.question.delete({
    where: {
      id: id,
    },
  });
};

// //end peer questions
