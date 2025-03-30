import { NextFunction, Request, Response } from 'express';
import { getSMSConfig, sendSMS, upsertSMSConfig } from '../services/sms.ts';

export const fetchSMSConfig = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getSMSConfig();
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const addMessage = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const response = await sendSMS(body);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}


export const updateSMSConfig = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await upsertSMSConfig(req.body);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}