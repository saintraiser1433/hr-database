
import { NextFunction, Request, Response } from 'express';
import { assignEmployeeToRequirements, assignTeamLead, getAllEmployees, getEmployeeInformationById, getEmployeesCountByDeptID, getRequirementsByEmployeeId, modifyCredentials, modifyInformation, modifyRequirementStatus, unAssignEmployeeToRequirements, unassignTeamlead, updateEmpImage } from '../services/employees.ts';
import { assignEmpToRequirements, handleValidationError } from '../utils/validation.ts';
import { CombinedData } from '../interfaces/index.ts';
import { parseId } from '../utils/parseId.ts';


export const fetchAllEmployeesByDeptID = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const deptId = parseId(req.params.id);
    if (!deptId) {
        return res.status(400).json({ error: "Invalid Criteria ID." });
    }

    try {
        const response = await getAllEmployees(deptId);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}




export const fetchRequirementByEmpID = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const empId = req.params.empId;
    try {
        const response = await getRequirementsByEmployeeId(empId);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const fetchEmployeeInformationById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const empId = Number(req.params.empId);
    try {
        const response = await getEmployeeInformationById(empId);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const fetchEmployeeCountByDeptId = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const deptId = parseId(req.query.deptId?.toString() || '');
    if (!deptId) {
        return res.status(400).json({ error: "Invalid Department ID." });
    }
    try{
        const response = await getEmployeesCountByDeptID(deptId);
        return res.status(200).json(response);
    }catch(err){
        next(err);
    }
}


export const insertEmptoRequire = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = assignEmpToRequirements.assign(body);
        if (error) {
            return handleValidationError(error, res);
        }


        const response = await assignEmployeeToRequirements(body);
        return res.status(200).json({ message: "Requirements succesfully inserted", data: response });
    } catch (err) {
        next(err);
    }
};


export const removeEmpToRequire = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const response = await unAssignEmployeeToRequirements(body);
        return res.status(200).json({ message: "Requirement successfully remove", data: response });
    } catch (err) {
        next(err)
    }
}

export const updateCredentials = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const employeeId = parseId(req.params.empId);
    if (!employeeId) {
        return res.status(400).json({ error: "Invalid Employee ID." });
    }
    try {
        await modifyCredentials(employeeId, body);
        return res.status(200).json({ message: "Successfully Updated"});
    } catch (err) {
        next(err)
    }
}


export const updateEmpRequireStatus = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const id = req.params.id;
    try {
        const response = await modifyRequirementStatus(id, body);
        return res.status(200).json({ message: "Screening Assign successfull", data: response });
    } catch (err) {
        next(err)
    }
}


export const updateEmpInformation = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body: CombinedData = req.body;
    const file = req.file?.filename;
    const id = Number(req.params.id);
    try {
        const response = await modifyInformation(id, body,file);
        return res.status(200).json({ message: "Successfully update Information", data: response });
    } catch (err) {
        next(err)
    }
}

export const modifyEmpImage = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const empId = parseId(req.params.id);
    const filename = req.file?.filename;
    if (!empId) {
        return res.status(400).json({ error: "Invalid Employee ID." });
    }
    try {
        const response = await updateEmpImage(empId, filename);
        return res.status(200).json({ message: "Image updated successfully", data: response });
    } catch (err) {
        next(err);
    }
}


export const assignStatusTeamlead = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = Number(req.params.empId);
    const body = req.body;
    try {
        const response = await assignTeamLead(id, body);
        return res.status(200).json({ message: "Successfully update role", data: response });
    } catch (err) {
        next(err)
    }
}

export const unassignStatusTeamlead = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = Number(req.params.empId);
    const body = req.body;
    try {
        const response = await unassignTeamlead(id, body);
        return res.status(200).json({ message: "Successfully update role", data: response });
    } catch (err) {
        next(err)
    }
}








