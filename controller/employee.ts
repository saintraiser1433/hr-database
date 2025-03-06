
import { NextFunction, Request, Response } from 'express';
import { getAllEmployees, getRequirementsByEmployeeId } from '../services/employees.ts';

export const fetchAllEmployeesByDeptID = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const deptId = req.params.id;
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















// export const insertDepartment = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
//     const body = req.body;
//     try {
//         const { error } = departmentValidation.insert(body);
//         if (error) {
//             return handleValidationError(error, res);
//         }
//         const response = await createDepartmentService(body);
//         return res.status(200).json({ message: "Department created successfully", data: response });
//     } catch (err) {
//         next(err);
//     }
// };

// export const updateDepartment = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
//     const body = req.body;
//     const id = req.params.id;
//     try {
//         const { error } = departmentValidation.update(body);
//         if (error) {
//             return handleValidationError(error, res);
//         }
//         const response = await updateDepartmentService(id, body);
//         return res.status(200).json({ message: "Department updated successfully", data: response });
//     } catch (err) {
//         next(err);
//     }
// }

// export const deleteDepartment = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
//     const id = req.params.id;
//     try {
//         await removeDepartmentService(id);
//         return res.status(200).json({ message: "Department deleted successfully" });
//     } catch (err) {
//         next(err)
//     }
// }