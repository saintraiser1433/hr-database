
import { NextFunction, Request, Response } from 'express';
import { handleValidationError, evaluationValidation } from '../utils/validation.ts';
import { createEvaluation, getEvaluationEmployeeCriteria, getEvaluation, getEvaluationOngoing, modifyEvaluation, removeEvaluation, insertTeamLeadEvaluation } from '../services/evaluation.ts';
import { parseId } from '../utils/parseId.ts';


export const fetchEvaluation = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getEvaluation();
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}
export const fetchEvaluationByOngoing = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getEvaluationOngoing();
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const fetchEvaluationEmployeeCriteria = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const employeeId = parseId(req.params.employeeId);
    const deptId = parseId(req.params.deptId);
    if (!employeeId) {
        return res.status(400).json({ error: "Invalid Question ID." });
    }
    if (!deptId) {
        return res.status(400).json({ error: "Invalid Department ID." });
    }
    try {
        const response = await getEvaluationEmployeeCriteria(employeeId,deptId);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}


export const insertEvaluation = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = evaluationValidation.insert(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await createEvaluation(body);
        return res.status(200).json({ message: "Evaluation created successfully", data: response });
    } catch (err) {
        next(err);
    }
};

export const updateEvaluation = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
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
        return res.status(200).json({ message: "Evaluation updated successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const deleteEvaluation = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        const evaluationId = parseInt(id, 10);
        if (isNaN(evaluationId)) throw new Error("Invalid Evaluation ID.");
        await removeEvaluation(evaluationId);
        return res.status(200).json({ message: "Evaluation removed successfully" });
    } catch (err) {
        next(err)
    }
}



export const submissionTeamLeadEvaluation = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        // const { error } = evaluationValidation.insert(body);
        // if (error) {
        //     return handleValidationError(error, res);
        // }
        const response = await insertTeamLeadEvaluation(body,body);
        return res.status(200).json({ message: "Evaluation created successfully", data: response });
    } catch (err) {
        next(err);
    }
};













