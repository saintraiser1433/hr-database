
import { NextFunction, Request, Response } from 'express';
import { handleValidationError, applicantsValidation } from '../utils/validation.ts';
import { createApplicants, getApplicantsFailed, getApplicantsOngoing, getApplicantsPassed, getApplicantsPending, getApplicantsRejected, getFailApprvStatusByApplicant, getOngoingStatusByApplicant, ongoingApplicants, rejectApplicant, updateFinalizedApplicantStatus } from '../services/applicant.ts';

export const fetchApplicantsByPending = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getApplicantsPending();
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const fetchApplicantsByFailed = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getApplicantsFailed();
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const fetchApplicantsByPassed = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getApplicantsPassed();
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}
export const fetchApplicantsByOngoing = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getApplicantsOngoing();
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const fetchOngoingByApplicant = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        const response = await getOngoingStatusByApplicant(id);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const fetchFailApproveByApplicant = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        const response = await getFailApprvStatusByApplicant(id);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const fetchApplicantsByRejected = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getApplicantsRejected();
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



export const proceedApplicant = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        const response = await ongoingApplicants(id);
        return res.status(200).json({ message: "Application successfully proceed", data: response });
    } catch (err) {
        next(err)
    }
}


export const rejectApplicants = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        const response = await rejectApplicant(id);
        return res.status(200).json({ message: "Applicantion successfully rejected", data: response });
    } catch (err) {
        next(err)
    }
}

export const modifyFinailizedAppStatus = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    const { status } = req.body;
    try {
        const response = await updateFinalizedApplicantStatus(id, status);

        return res.status(200).json({ message: "Application successfully updated", data: response });
    } catch (err) {
        next(err)
    }
}















