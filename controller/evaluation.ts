
import { NextFunction, Request, Response } from 'express';
import { handleValidationError, departmentValidation, evaluationValidation, questionValidation } from '../utils/validation';
import { createEvaluation, createEvaluationQuestion, getEvaluation, getEvaluationQuestion, modifyEvaluation, modifyEvaluationQuestion, removeEvaluation, removeEvaluationQuestion } from '../services/evaluation';


export const fetchEvaluation = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getEvaluation();
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
        const { error } = evaluationValidation.update(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await modifyEvaluation(id, body);
        return res.status(200).json({ message: "Evaluation updated successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const deleteEvaluation = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        await removeEvaluation(id);
        return res.status(200).json({ message: "Evaluation removed successfully" });
    } catch (err) {
        next(err)
    }
}


export const fetchEvaluationQuestion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        const response = await getEvaluationQuestion(id);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}


export const insertEvaluationQuestion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = questionValidation.insert(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await createEvaluationQuestion(body);
        return res.status(200).json({ message: "Question created successfully", data: response });
    } catch (err) {
        next(err);
    }
};

export const updateEvaluationQuestion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const id = req.params.id;
    try {
        const { error } = questionValidation.update(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await modifyEvaluationQuestion(id, body);
        return res.status(200).json({ message: "Question updated successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const deleteEvaluationQuestion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        await removeEvaluationQuestion(id);
        return res.status(200).json({ message: "Question removed successfully" });
    } catch (err) {
        next(err)
    }
}









