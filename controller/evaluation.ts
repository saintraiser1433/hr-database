import { NextFunction, Request, Response } from "express";
import {
  handleValidationError,
  evaluationValidation,
} from "../utils/validation.ts";
import {
  createEvaluation,
  getEvaluationEmployeeCriteria,
  getEvaluation,
  getEvaluationOngoing,
  modifyEvaluation,
  removeEvaluation,
  insertTeamLeadEvaluation,
  getTeamLeadResults,
  viewEvaluateQuestion,
  assignPeerEvaluations,
  viewPeerEvaluations,
  insertPeerEvaluationResult,
  getPeerEvaluateeByEmpId,
  getPeerCategoryQuestion,
  getPeerResult,
} from "../services/evaluation.ts";
import { parseId } from "../utils/parseId.ts";

export const fetchEvaluation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const response = await getEvaluation();
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
export const fetchEvaluationByOngoing = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const response = await getEvaluationOngoing();
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const fetchPeerEvaluateeByEmpId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const empId = parseId(req.params.empId);
  if (!empId) {
    return res.status(400).json({ error: "Invalid Employee ID." });
  }
  try {
    const response = await getPeerEvaluateeByEmpId(empId);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

export const fetchTeamLeadResults = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const acadId = parseId(req.params.acadId);
  if (!acadId) {
    return res.status(400).json({ error: "Invalid Evaluation ID." });
  }
  const employeesId = parseId(req.params.employeesId);
  if (!employeesId) {
    return res.status(400).json({ error: "Invalid Employees ID." });
  }
  try {
    const response = await getTeamLeadResults(acadId, employeesId);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const fetchEvaluationEmployeeCriteria = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const employeeId = parseId(req.params.employeeId);
  const acadId = parseId(req.params.acadId);
  if (!employeeId) {
    return res.status(400).json({ error: "Invalid Question ID." });
  }
  if (!acadId) {
    return res.status(400).json({ error: "Invalid Academic Year ID." });
  }
  try {
    const response = await getEvaluationEmployeeCriteria(employeeId, acadId);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};


export const fetchPeerCategoryQuestion = async (req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const acadId = parseId(req.params.acadId);
  if (!acadId) {
    return res.status(400).json({ error: "Invalid Academic Year ID." });
  }
  try {
    const response = await getPeerCategoryQuestion(acadId);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

export const fetchEvaluateQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const employeeId = parseId(req.params.employeeId);
  const acadId = parseId(req.params.acadId);
  if (!employeeId) {
    return res.status(400).json({ error: "Invalid Question ID." });
  }
  if (!acadId) {
    return res.status(400).json({ error: "Invalid Academic Year ID." });
  }
  try {
    const response = await viewEvaluateQuestion(employeeId, acadId);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};


export const insertEvaluation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const body = req.body;
  try {
    const { error } = evaluationValidation.insert(body);
    if (error) {
      return handleValidationError(error, res);
    }
    const response = await createEvaluation(body);
    return res
      .status(200)
      .json({ message: "Evaluation created successfully", data: response });
  } catch (err) {
    next(err);
  }
};

export const updateEvaluation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const body = req.body;
  const id = req.params.id;
  try {
    const academicYear = parseInt(id, 10);
    if (isNaN(academicYear)) throw new Error("Invalid Evaluation ID.");

    const { error } = evaluationValidation.update(body);
    if (error) {
      return handleValidationError(error, res);
    }
    const response = await modifyEvaluation(academicYear, body);
    return res
      .status(200)
      .json({ message: "Evaluation updated successfully", data: response });
  } catch (err) {
    next(err);
  }
};

export const deleteEvaluation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = req.params.id;
  try {
    const academicYearId = parseInt(id, 10);
    if (isNaN(academicYearId)) throw new Error("Invalid Evaluation ID.");
    await removeEvaluation(academicYearId);
    return res.status(200).json({ message: "Evaluation removed successfully" });
  } catch (err) {
    next(err);
  }
};

export const submissionTeamLeadEvaluation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { evaluate, headerStatus } = req.body;
  try {
    const evalData = evaluate.map((item: any) => ({
      academicYearId: item.academicYearId,
      teamLeadEvaluationId: item.categoryId,
      questionId: item.questionId,
      templateDetailId: item.templateDetailId,
      employeesId: item.employeesId
    }))

    const response = await insertTeamLeadEvaluation(evalData, headerStatus);
    return res
      .status(200)
      .json({ message: "Successfully Evaluate", data: response });
  } catch (err) {
    next(err);
  }
};


export const submissionPeerEvaluation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const body = req.body;
  try {
    const evalData = body.map((item: any) => ({
      academicYearId: item.academicYearId,
      peerCategoryId: item.categoryId,
      questionId: item.questionId,
      templateDetailId: item.templateDetailId,
      peerEvaluationId: item.peerEvalId
    }))

    const response = await insertPeerEvaluationResult(evalData, body[0].peerEvalId);
    return res
      .status(200)
      .json({ message: "Successfully Evaluate", data: response });
  } catch (err) {
    next(err);
  }
};



export const assigningPeerEvaluations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const body = req.body;

  try {
    const response = await assignPeerEvaluations(body);
    return res.status(200).json({ message: "Successfully assigning peers", data: response })
  } catch (err) {
    next(err);
  }

}

export const fetchPeerEvaluation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { acadId, deptId } = req.query;

  try {
    const response = await viewPeerEvaluations(Number(acadId), Number(deptId));
    return res.status(200).json(response)
  } catch (err) {
    next(err);
  }

}



export const fetchPeerResult = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { acadId, empId } = req.query;

  try {
    const response = await getPeerResult(Number(acadId), Number(empId));
    return res.status(200).json(response)
  } catch (err) {
    next(err);
  }

}









