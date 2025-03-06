
import { NextFunction, Request, Response } from 'express';
import { createRequirementService, getRequirementService, removeRequirementService, updateRequirementService } from '../services/requirements.ts';
import { handleValidationError, requirementValidation } from '../utils/validation.ts';


export const getRequirements = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getRequirementService();
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}


export const insertRequirements = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = requirementValidation.insert(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await createRequirementService(body);
        return res.status(200).json({ message: "Requirement created successfully", data: response });
    } catch (err) {
        next(err);
    }
};

export const updateRequirements = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const id = req.params.id;
    try {
        const { error } = requirementValidation.update(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await updateRequirementService(id, body);
        return res.status(200).json({ message: "Requirement updated successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const deleteRequirements = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        await removeRequirementService(id);
        return res.status(200).json({ message: "Requirement deleted successfully" });
    } catch (err) {
        next(err)
    }
}