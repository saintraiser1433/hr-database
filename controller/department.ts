
import { NextFunction, Request, Response } from 'express';
import { handleValidationError, departmentValidation } from '../utils/validation.ts';
import { createDepartmentService, getDepartmentService, removeDepartmentService, updateDepartmentService } from '../services/department.ts';


export const getDepartment = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const response = await getDepartmentService();
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}




export const insertDepartment = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = departmentValidation.insert(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await createDepartmentService(body);
        return res.status(200).json({ message: "Department created successfully", data: response });
    } catch (err) {
        next(err);
    }
};

export const updateDepartment = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const id = req.params.id;
    try {
        const { error } = departmentValidation.update(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await updateDepartmentService(id, body);
        return res.status(200).json({ message: "Department updated successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const deleteDepartment = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    try {
        await removeDepartmentService(id);
        return res.status(200).json({ message: "Department deleted successfully" });
    } catch (err) {
        next(err)
    }
}