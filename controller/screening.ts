
import { NextFunction, Request, Response } from 'express';
import {  assignAppScreeningValidation, assignScreeningValidation, handleValidationError, screeningValidation } from '../utils/validation.ts';
import { assignApplicantScreening, assignJobToScreening, createScreening, deleteApplicantScreening, deleteJobToScreening, deleteScreening, getJobScreeningsByJobId, getScreenings, selectScreeningByApplicantId, selectScreeningByJobId, updateJobScreeningSequence, updateScreenings } from '../services/screening.ts';
import { parseId } from '../utils/parseId.ts';





export const fetchScreenings = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getScreenings();
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}


export const addScreening = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = screeningValidation.insert(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await createScreening(body);
        return res.status(200).json({ message: "Screening Type created successfully", data: response });
    } catch (err) {
        next(err);
    }
};

export const modifyScreening = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const id = req.params.id;
    try {
        const { error } = screeningValidation.update(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await updateScreenings(id, body);
        return res.status(200).json({ message: "Screening Type updated successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const removeScreening = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        await deleteScreening(id);
        return res.status(200).json({ message: "Screening Type deleted successfully" });
    } catch (err) {
        next(err)
    }
}

export const filterScreeningTypeByJobId = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.jobId;
    try {
        const response = await selectScreeningByJobId(id);
        return res.status(200).json(response);
    } catch (err) {
        next(err)
    }
}






//assigning screening to job
export const fetchJobScreenings = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.jobId;
    try {
        const response = await getJobScreeningsByJobId(id);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const addJobToScreening = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = assignScreeningValidation.assign(body);
        if (error) {
            return handleValidationError(error, res);
        }


        const response = await assignJobToScreening(body);
        return res.status(200).json({ message: "Screening Assign successfully inserted", data: response });
    } catch (err) {
        next(err);
    }
};


export const unassignJobFromScreening = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {

        const response = await deleteJobToScreening(body);
        return res.status(200).json({ message: "Screening Assign successfully deleted", data: response });
    } catch (err) {
        next(err)
    }
}

export const modifyJobScreeningSequence = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    const { direction } = req.body;
    try {
        await updateJobScreeningSequence(id, direction);
        return res.status(200).json({ message: "Ok ah" });
    } catch (err) {
        next(err)
    }
}



//assigning screening to applicant

export const filterScreeningTypeByApplicantId = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const applicantId = parseId(req.params.applicantId);
    if (!applicantId) {
        return res.status(400).json({ error: "Invalid Applicant ID." });
    }
    try {
        const response = await selectScreeningByApplicantId(applicantId);
        return res.status(200).json(response);
    } catch (err) {
        next(err)
    }
}



export const addApplicantScreening = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = assignAppScreeningValidation.assign(body);
        if (error) {
            return handleValidationError(error, res);
        }


        const response = await assignApplicantScreening(body);
        return res.status(200).json({ message: "Screening Assign successfully inserted", data: response });
    } catch (err) {
        next(err);
    }
};


export const unassignApplicantScreening = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ error: "Invalid ID." });
    }
    try {

        const response = await deleteApplicantScreening(id);
        return res.status(200).json({ message: "Unassign screening type successfully removed", data: response });
    } catch (err) {
        next(err)
    }
}



