import { NextFunction, Request, Response } from "express";
import { getEvaluationTeamLeadCategory, createEvaluationTeamLeadCategory, modifyEvaluationTeamLeadCategory, removeEvaluationTeamLeadCategory, getEvaluationTeamLeadCriteria, createEvaluationTeamLeadCriteria, modifyEvaluationTeamLeadCriteria, removeEvaluationTeamLeadCriteria, createCriteriaQuestion, getCriteriaWithQuestion, modifyCriteriaQuestion, removeCriteriaQuestion } from "../services/teamlead.ts";
import { evalCategoryValidation, handleValidationError, subCategoryValidation } from "../utils/validation.ts";
import { parseId } from "../utils/parseId.ts";

//peer category
export const fetchEvaluationTeamLeadCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const evaluationId = parseId(req.params.id);
    if (!evaluationId) {
        return res.status(400).json({ error: "Invalid ID." });
    }
    try {

        const response = await getEvaluationTeamLeadCategory(evaluationId);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const insertEvaluationTeamLeadCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = evalCategoryValidation.validate(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await createEvaluationTeamLeadCategory(body);
        return res.status(200).json({ message: "Created Successfully", data: response });
    } catch (err) {
        next(err);
    }
};

export const updateEvaluationTeamLeadCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const ids = parseId(req.params.id);
    if (!ids) {
        return res.status(400).json({ error: "Invalid ID." });
    }
    try {

        const { error } = evalCategoryValidation.validate(body);
        if (error) {
            return handleValidationError(error, res);
        }

        const response = await modifyEvaluationTeamLeadCategory(ids, body);
        return res.status(200).json({ message: "Updated successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const deleteEvaluationTeamLeadCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ error: "Invalid ID." });
    }
    try {

        await removeEvaluationTeamLeadCategory(id);
        return res.status(200).json({ message: "Removed successfully" });
    } catch (err) {
        next(err)
    }
}
//end


//subcategory
export const fetchEvaluationTeamLeadCriteria = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ error: "Invalid ID." });
    }
    try {
        const response = await getEvaluationTeamLeadCriteria(id);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const insertEvaluationTeamLeadCriteria = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = subCategoryValidation.validate(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await createEvaluationTeamLeadCriteria(body);
        return res.status(200).json({ message: "Created Successfully", data: response });
    } catch (err) {
        next(err);
    }
};

export const updateEvaluationTeamLeadCriteria = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ error: "Invalid ID." });
    }
    try {
        const { error } = subCategoryValidation.validate(body);
        if (error) {
            return handleValidationError(error, res);
        }

        const response = await modifyEvaluationTeamLeadCriteria(id, body);
        return res.status(200).json({ message: "Updated successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const deleteEvaluationTeamLeadCriteria = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ error: "Invalid ID." });
    }
    try {
        await removeEvaluationTeamLeadCriteria(id);
        return res.status(200).json({ message: "Removed successfully" });
    } catch (err) {
        next(err)
    }
}


//end


export const fetchCriteriaQuestion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        const criteriaId = parseInt(id, 10);
        if (isNaN(criteriaId)) throw new Error("Invalid Question ID.");
        const response = await getCriteriaWithQuestion(criteriaId);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}


export const insertCriteriaQuestion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const response = await createCriteriaQuestion(body);
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