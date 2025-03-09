
import { NextFunction, Request, Response } from 'express';
import { createTemplate, getAllTemplate, removeTemplate, updateTemplate } from '../services/template.ts';
import { handleValidationError, templateValidation } from '../utils/validation.ts';




export const fetchTemplate = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getAllTemplate();
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}


export const insertTemplate = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = templateValidation.insert(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await createTemplate(body);
        return res.status(200).json({ message: "Template created successfully", data: response });
    } catch (err) {
        next(err);
    }
};

export const modifyTemplate = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const id = req.params.id;
    try {
        const templateId = parseInt(id, 10);
        if (isNaN(templateId)) throw new Error("Invalid Template ID.");

        const { error } = templateValidation.update(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await updateTemplate(templateId, body);
        return res.status(200).json({ message: "Template updated successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const deleteTemplate = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        const templateId = parseInt(id, 10);
        if (isNaN(templateId)) throw new Error("Invalid Template ID.");
        await removeTemplate(templateId);
        return res.status(200).json({ message: "Template deleted successfully" });
    } catch (err) {
        next(err)
    }
}


