
import { NextFunction, Request, Response } from 'express';
import { assignScreeningValidation, handleValidationError, screeningValidation } from '../utils/validation';
import { assignJobScreeningService, createScreeningService, deleteAssignJobScreeningService, getAllJobScreeningService, getScreeningService, removeScreeningService, updateAssignJobScreeningService, updateScreeningService } from '../services/screening';





export const getScreening = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getScreeningService();
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}


export const insertScreening = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = screeningValidation.insert(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await createScreeningService(body);
        return res.status(200).json({ message: "Screening Type created successfully", data: response });
    } catch (err) {
        next(err);
    }
};

export const updateScreening = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const id = req.params.id;
    try {
        const { error } = screeningValidation.update(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await updateScreeningService(id, body);
        return res.status(200).json({ message: "Screening Type updated successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const deleteScreening = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        await removeScreeningService(id);
        return res.status(200).json({ message: "Screening Type deleted successfully" });
    } catch (err) {
        next(err)
    }
}


//assigning
export const getAllJobScreening = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getAllJobScreeningService();
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const insertAssignJobScreening = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = assignScreeningValidation.assign(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await assignJobScreeningService(body);
        return res.status(200).json({ message: "Screening Assign successfully inserted", data: response });
    } catch (err) {
        next(err);
    }
};

export const updateAssignJobScreening = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const jobId = req.params.jobId;
    const screeningId = req.params.screeningId;
    try {
        const { error } = assignScreeningValidation.assign(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await updateAssignJobScreeningService(jobId, screeningId, body);
        return res.status(200).json({ message: "Screening Assign successfully updated", data: response });
    } catch (err) {
        next(err);
    }
}

export const deleteAssignJobScreening = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const jobId = req.params.jobId;
    const screeningId = req.params.screeningId;
    try {
        await deleteAssignJobScreeningService(jobId, screeningId);
        return res.status(200).json({ message: "Screening Assign successfully deleted" });
    } catch (err) {
        next(err)
    }
}

