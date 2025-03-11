
import { NextFunction, Request, Response } from 'express';
import { handleValidationError, templateDetailValidation, templateValidation } from '../utils/validation.ts';
import { createTemplateDetail, createTemplateHeader, getAllTemplateDetail, getAllTemplateHeader, removeTemplateDetail, removeTemplateHeader, updateTemplateDetail, updateTemplateHeader } from '../services/template.ts';
import { bundleUpdateTemplatePeer, assignTemplatePeer } from '../services/peer.ts';
import { assignTemplateTeamLead, bundleUpdateTemplateTeamLead } from '../services/teamlead.ts';
import { parseId } from '../utils/parseId.ts';



export const fetchTemplateHeader = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getAllTemplateHeader();
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}


export const insertTemplateHeader = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = templateValidation.insert(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await createTemplateHeader(body);
        return res.status(200).json({ message: "Template created successfully", data: response });
    } catch (err) {
        next(err);
    }
};

export const modifyTemplateHeader = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const id = req.params.id;
    try {
        const templateId = parseInt(id, 10);
        if (isNaN(templateId)) throw new Error("Invalid Template ID.");

        const { error } = templateValidation.update(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await updateTemplateHeader(templateId, body);
        return res.status(200).json({ message: "Template updated successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const deleteTemplateHeader = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        const templateId = parseInt(id, 10);
        if (isNaN(templateId)) throw new Error("Invalid Template ID.");
        await removeTemplateHeader(templateId);
        return res.status(200).json({ message: "Template deleted successfully" });
    } catch (err) {
        next(err)
    }
}


//end

export const fetchTemplateDetail = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        const templateId = parseInt(id, 10);
        if (isNaN(templateId)) throw new Error("Invalid Template ID.");
        const response = await getAllTemplateDetail(templateId);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}


export const insertTemplateDetail = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = templateDetailValidation.insert(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await createTemplateDetail(body);
        return res.status(200).json({ message: "Template created successfully", data: response });
    } catch (err) {
        next(err);
    }
};

export const modifyTemplateDetail = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const id = req.params.id;
    try {
        const templateId = parseInt(id, 10);
        if (isNaN(templateId)) throw new Error("Invalid Template ID.");

        const { error } = templateDetailValidation.update(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await updateTemplateDetail(templateId, body);
        return res.status(200).json({ message: "Template updated successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const deleteTemplateDetail = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        const templateId = parseInt(id, 10);
        if (isNaN(templateId)) throw new Error("Invalid Template ID.");
        await removeTemplateDetail(templateId);
        return res.status(200).json({ message: "Template deleted successfully" });
    } catch (err) {
        next(err)
    }
}





//assigning template
export const modifyBundleTemplatePeer = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const evaluationId = parseId(req.params.evaluationId);
    if (!evaluationId) {
        return res.status(400).json({ error: "Invalid Template ID." });
    }
    try {

        const response = await bundleUpdateTemplatePeer(evaluationId, body);
        return res.status(200).json({ message: "Update template successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const modifyTemplatePeer = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const peerId = parseId(req.params.peerId);
    if (!peerId) {
        return res.status(400).json({ error: "Invalid Template ID." });
    }
    try {
        const response = await assignTemplatePeer(peerId, body);
        return res.status(200).json({ message: "Update template successfully", data: response });
    } catch (err) {
        next(err);
    }
}


export const modifyBundleTemplateTeamLead = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const evaluationId = parseId(req.params.evaluationId);
    if (!evaluationId) {
        return res.status(400).json({ error: "Invalid Template ID." });
    }
    try {
        const response = await bundleUpdateTemplateTeamLead(evaluationId, body);
        return res.status(200).json({ message: "Update template successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const modifyTemplateTeamLead = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const id = req.params.id;
    try {
        const teamleadId = parseInt(id, 10);
        if (isNaN(teamleadId)) throw new Error("Invalid Template ID.");

        const response = await assignTemplateTeamLead(teamleadId, body);
        return res.status(200).json({ message: "Update template successfully", data: response });
    } catch (err) {
        next(err);
    }
}


