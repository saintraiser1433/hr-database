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

export const fetchTeamLeadResults = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const evaluationId = parseId(req.params.evaluationId);
  if (!evaluationId) {
    return res.status(400).json({ error: "Invalid Evaluation ID." });
  }
  const employeesId = parseId(req.params.employeesId);
  if (!employeesId) {
    return res.status(400).json({ error: "Invalid Employees ID." });
  }
  try {
    const response = await getTeamLeadResults(evaluationId, employeesId);
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
  const evalId = parseId(req.params.evalId);
  if (!employeeId) {
    return res.status(400).json({ error: "Invalid Question ID." });
  }
  if (!evalId) {
    return res.status(400).json({ error: "Invalid Evaluation ID." });
  }
  try {
    const response = await getEvaluationEmployeeCriteria(employeeId, evalId);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const fetchEvaluateQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const employeeId = parseId(req.params.employeeId);
  const evalId = parseId(req.params.evalId);
  if (!employeeId) {
    return res.status(400).json({ error: "Invalid Question ID." });
  }
  if (!evalId) {
    return res.status(400).json({ error: "Invalid Evaluation ID." });
  }
  try {
    const response = await viewEvaluateQuestion(employeeId, evalId);
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
    const evaluationId = parseInt(id, 10);
    if (isNaN(evaluationId)) throw new Error("Invalid Evaluation ID.");

    const { error } = evaluationValidation.update(body);
    if (error) {
      return handleValidationError(error, res);
    }
    const response = await modifyEvaluation(evaluationId, body);
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
    const evaluationId = parseInt(id, 10);
    if (isNaN(evaluationId)) throw new Error("Invalid Evaluation ID.");
    await removeEvaluation(evaluationId);
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
      evaluationId: item.evaluationId,
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





