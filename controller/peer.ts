import { NextFunction, Request, Response } from "express";
import { getEvaluationPeerCategory, createEvaluationPeerCategory, modifyEvaluationPeerCategory, removeEvaluationPeerCategory } from "../services/peer.ts";
import { categoryValidation, handleValidationError, questionValidation } from "../utils/validation.ts";
import { parseId } from "../utils/parseId.ts";

//peer category
export const fetchEvaluationPeerCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const acadId = parseId(req.params.id);
    if (!acadId) {
        return res.status(400).json({ error: "Invalid Academic Year ID." });
    }
    try {
        const response = await getEvaluationPeerCategory(acadId);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const insertEvaluationPeerCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = categoryValidation.validate(body);
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
        const { error } = categoryValidation.validate(body);
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


