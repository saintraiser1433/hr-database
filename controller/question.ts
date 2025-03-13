import { NextFunction, Request, Response } from "express";
import { getCriteriaWithQuestion, createCriteriaQuestion, modifyCriteriaQuestion, removeCriteriaQuestion, getPeerCriteriaQuestion, getCustomCriteriaWithQuestion } from "../services/questions.ts";
import { parseId } from "../utils/parseId.ts";

export const fetchCriteriaQuestion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const criteriaId = parseId(req.params.id);
    if (!criteriaId) {
        return res.status(400).json({ error: "Invalid Criteria ID." });
    }
    try {
        const response = await getCriteriaWithQuestion(criteriaId);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const fetchCustomCriteriaQuestion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const criteriaId = parseId(req.params.id);
    if (!criteriaId) {
        return res.status(400).json({ error: "Invalid Criteria ID." });
    }
    try {
        const response = await getCustomCriteriaWithQuestion(criteriaId);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const fetchEvaluationPeerQuestion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const questionId = parseId(req.params.id);
    if (!questionId) {
        return res.status(400).json({ error: "Invalid Question ID." });
    }
    try {
        const response = await getPeerCriteriaQuestion(questionId);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}




export const insertCriteriaQuestion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const response = await createCriteriaQuestion(body, body.type);
        return res.status(200).json({ message: "Question created successfully", data: response });
    } catch (err) {
        next(err);
    }
};

export const updateCriteriaQuestion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const questionId = parseId(req.params.id);
    if (!questionId) {
        return res.status(400).json({ error: "Invalid Question ID." });
    }
    try {
        const response = await modifyCriteriaQuestion(questionId, body);
        return res.status(200).json({ message: "Question updated successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const deleteCriteriaQuestion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const questionId = parseId(req.params.id);
    if (!questionId) {
        return res.status(400).json({ error: "Invalid Question ID." });
    }
    try {
        await removeCriteriaQuestion(questionId);
        return res.status(200).json({ message: "Question removed successfully" });
    } catch (err) {
        next(err)
    }
}