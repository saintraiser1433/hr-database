import { NextFunction, Request, Response } from "express";
import { getEvaluationPeerCategory, createEvaluationPeerCategory, modifyEvaluationPeerCategory, removeEvaluationPeerCategory, getEvaluationPeerQuestion, createEvaluationPeerQuestion, modifyEvaluationPeerQuestion, removeEvaluationPeerQuestion } from "../services/peer.ts";
import { evalCategoryValidation, handleValidationError, questionValidation } from "../utils/validation.ts";
import { parseId } from "../utils/parseId.ts";

//peer category
export const fetchEvaluationPeerCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const evaluationId = parseId(req.params.id);
    if (!evaluationId) {
        return res.status(400).json({ error: "Invalid Evaluation ID." });
    }
    try {
        const response = await getEvaluationPeerCategory(evaluationId);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const insertEvaluationPeerCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = evalCategoryValidation.validate(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await createEvaluationPeerCategory(body);
        return res.status(200).json({ message: "Created Successfully", data: response });
    } catch (err) {
        next(err);
    }
};

export const updateEvaluationPeerCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const peerId = parseId(req.params.id);
    if (!peerId) {
        return res.status(400).json({ error: "Invalid Question ID." });
    }
    try {
        const { error } = evalCategoryValidation.validate(body);
        if (error) {
            return handleValidationError(error, res);
        }

        const response = await modifyEvaluationPeerCategory(peerId, body);
        return res.status(200).json({ message: "Updated successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const deleteEvaluationPeerCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const peerId = parseId(req.params.id);
    if (!peerId) {
        return res.status(400).json({ error: "Invalid Question ID." });
    }
    try {
        await removeEvaluationPeerCategory(peerId);
        return res.status(200).json({ message: "Removed successfully" });
    } catch (err) {
        next(err)
    }
}
//end


export const fetchEvaluationPeerQuestion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const questionId = parseId(req.params.id);
    if (!questionId) {
        return res.status(400).json({ error: "Invalid Question ID." });
    }
    try {
        const response = await getEvaluationPeerQuestion(questionId);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}


export const insertEvaluationPeerQuestion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = questionValidation.insert(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await createEvaluationPeerQuestion(body);
        return res.status(200).json({ message: "Question created successfully", data: response });
    } catch (err) {
        next(err);
    }
};

export const updateEvaluationPeerQuestion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const questionId = parseId(req.params.id);
    if (!questionId) {
        return res.status(400).json({ error: "Invalid Question ID." });
    }
    try {
        const { error } = questionValidation.update(body);
        if (error) {
            return handleValidationError(error, res);
        }

        const response = await modifyEvaluationPeerQuestion(questionId, body);
        return res.status(200).json({ message: "Question updated successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const deleteEvaluationPeerQuestion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const questionId = parseId(req.params.id);
    if (!questionId) {
        return res.status(400).json({ error: "Invalid Question ID." });
    }
    try {
        await removeEvaluationPeerQuestion(questionId);
        return res.status(200).json({ message: "Question removed successfully" });
    } catch (err) {
        next(err)
    }
}