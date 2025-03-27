
import { NextFunction, Request, Response } from 'express';
import { handleValidationError, applicantsValidation } from '../utils/validation.ts';
import { createApplicants, getApplicantCountByJob, getApplicantsFailed, getApplicantsOngoing, getApplicantsPassed, getApplicantsPending, getApplicantsRejected, getApplicantTopJob, getFailApprvStatusByApplicant, getOngoingStatusByApplicant, ongoingApplicants, rejectApplicant, updateFinalizedApplicantStatus } from '../services/applicant.ts';
import { parseId } from '../utils/parseId.ts';

export const fetchApplicantsByPending = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getApplicantsPending();
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const fetchApplicantTopJob = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getApplicantTopJob();
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const fetchApplicantCountByJob = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getApplicantCountByJob();
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
    const files = req.files as Record<string, Express.Multer.File[]>;
    const resumeFilename = files['resume_path'][0].filename;
    const photoFilename = files['photo_path'][0].filename;
    try {
        const { error } = applicantsValidation.insert({ ...body, resume_path: resumeFilename, photo_path: photoFilename });
        if (error) {
            return handleValidationError(error, res);
        }


        const response = await createApplicants(body, resumeFilename, photoFilename);
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
    const { status, jobId } = req.body;
    const applicantId = parseId(req.params.id);
    if (!applicantId) {
        return res.status(400).json({ error: "Invalid Applicant ID." });
    }
    const jobIds = parseId(jobId);
    if (!jobIds) {
        return res.status(400).json({ error: "Invalid Job ID." });
    }
    try {
        const response = await updateFinalizedApplicantStatus(applicantId, jobIds, status);

        return res.status(200).json({ message: "Application successfully updated", data: response });
    } catch (err) {
        next(err)
    }
}
















