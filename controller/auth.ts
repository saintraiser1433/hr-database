import { NextFunction, Request, Response } from "express";
import { refreshTokenService, signInService, signOutService, validateRefreshToken } from "../services/auth.ts";
import { TokenDetail } from "../interfaces/index.ts";


export const signIn = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res
                .status(401)
                .json({ error: "Please provide username and password " });
        }
        const response = await signInService(username, password);
        return res.status(200).json(response);
    } catch (err) {
        next(err)
    }
};



export const signOut = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const id = req.params.id;
    try {
        const response = await signOutService(Number(id))
        return res.status(200).json({ message: response.message })
    } catch (err) {
        next(err);
    }

};




export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "No Token Provided ",
        });
    }

    try {
        const decoded = validateRefreshToken(token) as TokenDetail;
        const response = await refreshTokenService(decoded.id, token);
        return res.status(200).json(response);
    } catch (err) {
        next(err);

    }
};
