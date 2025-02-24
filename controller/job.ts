
import { NextFunction, Request, Response } from 'express';
import { handleValidationError, jobValidation } from '../utils/validation';
import { createJobService, getJobService, removeJobService, updateJobService } from '../services/job';


export const getJob = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getJobService();
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}


export const insertJob = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = jobValidation.insert(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await createJobService(body);
        return res.status(200).json({ message: "Job created successfully", data: response });
    } catch (err) {
        next(err);
    }
};

export const updateJob = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const id = req.params.id;
    try {
        const { error } = jobValidation.update(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await updateJobService(id, body);
        return res.status(200).json({ message: "Job updated successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        await removeJobService(id);
        return res.status(200).json({ message: "Job deleted successfully" });
    } catch (err) {
        next(err)
    }
}