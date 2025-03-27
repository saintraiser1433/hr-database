import { NextFunction, Request, Response } from 'express';
import { getAllSummary } from '../services/summary.ts';
export const fetchAllSummary = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getAllSummary();
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}