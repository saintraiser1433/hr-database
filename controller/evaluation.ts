
import { NextFunction, Request, Response } from 'express';
import { handleValidationError, departmentValidation, evaluationValidation, questionValidation, peerCategoryValidation } from '../utils/validation.ts';
import { createEvaluation, createEvaluationPeerCategory, createEvaluationPeerQuestion, getEvaluation, getEvaluationPeerCategory, getEvaluationPeerQuestion, modifyEvaluation, modifyEvaluationPeerCategory, modifyEvaluationPeerQuestion, removeEvaluation, removeEvaluationPeerCategory, removeEvaluationPeerQuestion } from '../services/evaluation.ts';


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

//peer category
export const fetchEvaluationPeerCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        const evaluationId = parseInt(id, 10);
        if (isNaN(evaluationId)) throw new Error("Invalid Evaluation ID.");
        const response = await getEvaluationPeerCategory(evaluationId);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const insertEvaluationPeerCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = peerCategoryValidation.validate(body);
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
    const id = req.params.id;
    try {
        const peerId = parseInt(id, 10);
        if (isNaN(peerId)) throw new Error("Invalid Peer ID.");

        const { error } = peerCategoryValidation.validate(body);
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
    const id = req.params.id;
    try {
        const peerId = parseInt(id, 10);
        if (isNaN(peerId)) throw new Error("Invalid Peer ID.");
        await removeEvaluationPeerCategory(peerId);
        return res.status(200).json({ message: "Removed successfully" });
    } catch (err) {
        next(err)
    }
}
//end


export const fetchEvaluationPeerQuestion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        const questionId = parseInt(id, 10);
        if (isNaN(questionId)) throw new Error("Invalid Question ID.");
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
    const id = req.params.id;
    try {
        const questionId = parseInt(id, 10);
        if (isNaN(questionId)) throw new Error("Invalid Question ID.");

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
    const id = req.params.id;
    try {
        const questionId = parseInt(id, 10);
        if (isNaN(questionId)) throw new Error("Invalid Question ID.");
        await removeEvaluationPeerQuestion(questionId);
        return res.status(200).json({ message: "Question removed successfully" });
    } catch (err) {
        next(err)
    }
}









