
import { NextFunction, Request, Response } from 'express';
import { assignScreeningValidation, handleValidationError, screeningValidation } from '../utils/validation';
import { assignJobToScreening, createScreening, deleteJobScreening, deleteScreening, getJobScreenings, getScreenings, selectScreeningByJobId, updateJobScreeningSequence, updateScreenings } from '../services/screening';





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




//assigning
export const fetchJobScreenings = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getJobScreenings();
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
        await deleteJobScreening(body);
        return res.status(200).json({ message: "Screening Assign successfully deleted" });
    } catch (err) {
        next(err)
    }
}

export const modifyJobScreeningSequence = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const jobId = req.params.jobId;
    const screeningId = req.params.screeningId;
    try {
        await updateJobScreeningSequence(jobId, screeningId);
        return res.status(200).json({ message: "Screening Assign successfully deleted" });
    } catch (err) {
        next(err)
    }
}

