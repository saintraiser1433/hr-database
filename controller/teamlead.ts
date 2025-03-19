import { NextFunction, Request, Response } from "express";
import { getColleagueByDept, createCriteriaByColleague, modifyCriteriaByColleague, removeEvaluationCriteriaByColleague, getCriteriaByColleague, getEvaluationTeamLeadCategory, createEvaluationTeamLeadCategory, modifyEvaluationTeamLeadCategory, removeEvaluationTeamLeadCategory, getEvaluationTeamLeadCriteria, createEvaluationTeamLeadCriteria, modifyEvaluationTeamLeadCriteria, removeEvaluationTeamLeadCriteria, getFilterCategoryByLead } from "../services/teamlead.ts";
import { categoryValidation, handleValidationError, subCategoryValidation } from "../utils/validation.ts";
import { parseId } from "../utils/parseId.ts";

//peer category
export const fetchEvaluationTeamLeadCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const academicYearId = parseId(req.params.id);
    if (!academicYearId) {
        return res.status(400).json({ error: "Invalid ID." });
    }
    try {

        const response = await getEvaluationTeamLeadCategory(academicYearId);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const insertEvaluationTeamLeadCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = categoryValidation.validate(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await createEvaluationTeamLeadCategory(body);
        return res.status(200).json({ message: "Created Successfully", data: response });
    } catch (err) {
        next(err);
    }
};

export const updateEvaluationTeamLeadCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const ids = parseId(req.params.id);
    if (!ids) {
        return res.status(400).json({ error: "Invalid ID." });
    }
    try {

        const { error } = categoryValidation.validate(body);
        if (error) {
            return handleValidationError(error, res);
        }

        const response = await modifyEvaluationTeamLeadCategory(ids, body);
        return res.status(200).json({ message: "Updated successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const deleteEvaluationTeamLeadCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ error: "Invalid ID." });
    }
    try {

        await removeEvaluationTeamLeadCategory(id);
        return res.status(200).json({ message: "Removed successfully" });
    } catch (err) {
        next(err)
    }
}
//end


//subcategory
export const fetchEvaluationTeamLeadCriteria = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ error: "Invalid ID." });
    }
    try {
        const response = await getEvaluationTeamLeadCriteria(id);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const insertEvaluationTeamLeadCriteria = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const { error } = subCategoryValidation.validate(body);
        if (error) {
            return handleValidationError(error, res);
        }
        const response = await createEvaluationTeamLeadCriteria(body);
        return res.status(200).json({ message: "Created Successfully", data: response });
    } catch (err) {
        next(err);
    }
};

export const updateEvaluationTeamLeadCriteria = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ error: "Invalid ID." });
    }
    try {
        const { error } = subCategoryValidation.validate(body);
        if (error) {
            return handleValidationError(error, res);
        }

        const response = await modifyEvaluationTeamLeadCriteria(id, body);
        return res.status(200).json({ message: "Updated successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const deleteEvaluationTeamLeadCriteria = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ error: "Invalid ID." });
    }
    try {
        await removeEvaluationTeamLeadCriteria(id);
        return res.status(200).json({ message: "Removed successfully" });
    } catch (err) {
        next(err)
    }
}


//end



//fetch for data for teamlead module
export const fetchFilterCategoryByLead = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const academicYearId = parseId(req.params.id);
    if (!academicYearId) {
        return res.status(400).json({ error: "Invalid Academic Year ID." });
    }
    try {
        const response = await getFilterCategoryByLead(academicYearId);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const fetchColleagueByDept = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const departmentId = parseId(req.params.deptId);
    if (!departmentId) {
        return res.status(400).json({ error: "Invalid Department ID." });
    }
    try {
        const response = await getColleagueByDept(departmentId);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}



//team lead module criteria module
export const fetchCriteriaByColleague = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { acadId, empId } = req.query;
    try {
        const response = await getCriteriaByColleague(Number(acadId), Number(empId));
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const insertCriteriaByColleague = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    try {
        const response = await createCriteriaByColleague(body);
        return res.status(200).json({ message: "Criteria inserted successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const updateCriteriaByColleague = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const body = req.body;
    const criteriaId = parseId(req.params.id);
    if (!criteriaId) {
        return res.status(400).json({ error: "Invalid Criteria ID." });
    }
    try {
        const response = await modifyCriteriaByColleague(criteriaId, body);
        return res.status(200).json({ message: "Criteria updated successfully", data: response });
    } catch (err) {
        next(err);
    }
}

export const deleteCriteriaByColleague = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const criteriaId = parseId(req.params.id);
    if (!criteriaId) {
        return res.status(400).json({ error: "Invalid Criteria ID." });
    }
    try {
        const response = await removeEvaluationCriteriaByColleague(criteriaId);
        return res.status(200).json({ message: "Criteria deleted successfully", data: response });
    } catch (err) {
        next(err);
    }
}

