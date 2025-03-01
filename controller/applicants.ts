
import { NextFunction, Request, Response } from 'express';
import { handleValidationError, applicantsValidation } from '../utils/validation';
import { createApplicants, getApplicants, rejectApplicant } from '../services/applicant';

export const fetchApplicants = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getApplicants();
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const insertApplicants = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = applicantsValidation.insert(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await createApplicants(body);
        return res.status(200).json({ message: "Successfully Submitted", data: response });
    } catch (err) {
        next(err);
    }
};



export const rejectApplicants = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        await rejectApplicant(id);
        return res.status(200).json({ message: "Applicantion successfully rejected" });
    } catch (err) {
        next(err)
    }
}














