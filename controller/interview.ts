
import { NextFunction, Request, Response } from 'express';
import { updateInterviewDate, updateInterviewStatus } from '../services/interview.ts';





export const modifyInterviewDate = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    const { date } = req.body;
    try {
        const response = await updateInterviewDate(id, date);
        return res.status(200).json({ message: "Successfully update time", data: response });
    } catch (err) {
        next(err)
    }
}


export const modifyInterviewUpdate = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    const { status } = req.body;
    try {
        const response = await updateInterviewStatus(id, status);
        return res.status(200).json({ message: "Successfully update status", data: response });
    } catch (err) {
        next(err)
    }
}

