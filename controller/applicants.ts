
import { NextFunction, Request, Response } from 'express';
import { handleValidationError, applicantsValidation } from '../utils/validation';
import { createApplicants, getApplicantsOngoing, getApplicantsPending, getApplicantsRejected, rejectApplicant } from '../services/applicant';

export const fetchApplicantsByPending = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getApplicantsPending();
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



// export const upda = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
//     const id = req.params.id;
//     try {
//         await rejectApplicant(id);
//         return res.status(200).json({ message: "Applicantion successfully rejected" });
//     } catch (err) {
//         next(err)
//     }
// }


export const rejectApplicants = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    const { rejectedDate } = req.body;
    try {
        await rejectApplicant(id, rejectedDate);
        return res.status(200).json({ message: "Applicantion successfully rejected" });
    } catch (err) {
        next(err)
    }
}














