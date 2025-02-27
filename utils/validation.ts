import Joi from 'joi';
import { Response } from 'express';
import { DepartmentModel, EvaluationModel, JobModel, JobScreeningModel, QuestionModel, RequirementModel, ScreeningModel } from '../types';
import { appLogger } from './logger';

export const requirementValidation = {
    insert: (data: RequirementModel) => {
        const schema = Joi.object({
            title: Joi.string().required().messages({
                "any.required": "The title field is required",
                "string.empty": "The title field cannot be empty"
            }),
            description: Joi.string().required().messages({
                "any.required": "The description field is required",
                "string.empty": "The description field cannot be empty"
            }),
        });
        return schema.validate(data, { abortEarly: false });
    },
    update: (data: RequirementModel) => {
        const schema = Joi.object({
            id: Joi.number().required().messages({
                "any.required": "The ID field is required",
                "number.base": "The ID field must be a number"
            }),
            title: Joi.string().optional().messages({
                "string.empty": "The title field cannot be empty"
            }),
            description: Joi.string().optional().messages({
                "string.empty": "The description field cannot be empty"
            }),
        });
        return schema.validate(data, { abortEarly: false });
    },
};


export const jobValidation = {
    insert: (data: JobModel) => {
        const schema = Joi.object({
            title: Joi.string().required().messages({
                "any.required": "The title field is required",
                "string.empty": "The title field cannot be empty"
            }),
            description: Joi.string().required().messages({
                "any.required": "The description field is required",
                "string.empty": "The description field cannot be empty"
            }),
            totalAvailable: Joi.number().required().messages({
                "any.required": "The availability field is required",
                "number.empty": "The availability field cannot be empty"
            }),
            departmentsId: Joi.number().required().messages({
                "any.required": "The department field is required",
                "number.empty": "The department field cannot be empty"
            }),
            status: Joi.boolean().optional(),
            headerImage: Joi.string().optional(),
        });
        return schema.validate(data, { abortEarly: false });
    },
    update: (data: JobModel) => {
        const schema = Joi.object({
            id: Joi.number().required().messages({
                "any.required": "The ID field is required",
                "number.base": "The ID field must be a number"
            }),
            title: Joi.string().required().messages({
                "any.required": "The title field is required",
                "string.empty": "The title field cannot be empty"
            }),
            description: Joi.string().required().messages({
                "any.required": "The description field is required",
                "string.empty": "The description field cannot be empty"
            }),
            totalAvailable: Joi.number().required().messages({
                "any.required": "The availability field is required",
                "number.empty": "The availability field cannot be empty"
            }),
            departmentsId: Joi.number().required().messages({
                "any.required": "The department field is required",
                "number.empty": "The department field cannot be empty"
            }),
            status: Joi.boolean().optional(),
            headerImage: Joi.string().optional(),
        });
        return schema.validate(data, { abortEarly: false });
    },
};


export const screeningValidation = {
    insert: (data: ScreeningModel) => {
        const schema = Joi.object({
            id: Joi.number().optional(),
            title: Joi.string().required().messages({
                "any.required": "The title field is required",
                "string.empty": "The title field cannot be empty"
            }),
            description: Joi.string().required().messages({
                "any.required": "The description field is required",
                "string.empty": "The description field cannot be empty"
            }),
        });
        return schema.validate(data, { abortEarly: false });
    },
    update: (data: ScreeningModel) => {
        const schema = Joi.object({
            id: Joi.number().required().messages({
                "any.required": "The ID field is required",
                "number.base": "The ID field must be a number"
            }),
            title: Joi.string().required().messages({
                "any.required": "The title field is required",
                "string.empty": "The title field cannot be empty"
            }),
            description: Joi.string().required().messages({
                "any.required": "The description field is required",
                "string.empty": "The description field cannot be empty"
            }),
            status: Joi.boolean().optional()
        });
        return schema.validate(data, { abortEarly: false });
    },
};

export const departmentValidation = {
    insert: (data: DepartmentModel) => {
        const schema = Joi.object({
            title: Joi.string().required().messages({
                "any.required": "The title field is required",
                "string.empty": "The title field cannot be empty"
            }),
        });
        return schema.validate(data, { abortEarly: false });
    },
    update: (data: DepartmentModel) => {
        const schema = Joi.object({
            id: Joi.number().required().messages({
                "any.required": "The ID field is required",
                "number.base": "The ID field must be a number"
            }),
            title: Joi.string().required().messages({
                "any.required": "The title field is required",
                "string.empty": "The title field cannot be empty"
            }),
            status: Joi.boolean().optional()
        });
        return schema.validate(data, { abortEarly: false });
    },
};


export const assignScreeningValidation = {
    assign: (data: JobScreeningModel) => {
        const schema = Joi.array().items(
            Joi.object({
                id: Joi.number().optional(),
                screening_title: Joi.string().optional(),
                job_id: Joi.number().required().messages({
                    "any.required": "The Job field is required",
                    "number.base": "The Job field must be a number",
                }),
                screening_id: Joi.number().required().messages({
                    "any.required": "The Screening field is required",
                    "number.base": "The Screening field must be a number",
                }),
                sequence_number: Joi.number().optional()
            })
        );
        return schema.validate(data, { abortEarly: false });
    },
};


export const evaluationValidation = {
    insert: (data: EvaluationModel) => {
        const schema = Joi.object({
            id: Joi.number().optional(),
            school_year: Joi.string().required().messages({
                "any.required": "The School Year field is required",
                "string.empty": "The School Year field is required"
            }),
            semester: Joi.number().required().messages({
                "any.required": "The semester field is required",
                "number.empty": "The semester field cannot be empty"
            }),
            status: Joi.string().optional()

        });
        return schema.validate(data, { abortEarly: false });
    },
    update: (data: EvaluationModel) => {
        const schema = Joi.object({
            id: Joi.number().required().messages({
                "any.required": "The ID field is required",
                "number.base": "The ID field must be a number"
            }),
            school_year: Joi.string().required().messages({
                "any.required": "The School Year field is required",
                "string.empty": "The School Year field is required"
            }),
            semester: Joi.number().required().messages({
                "any.required": "The semester field is required",
                "number.empty": "The semester field cannot be empty"
            }),
            status: Joi.string().required().messages({
                "any.required": "The status field is required",
                "string.empty": "The status field cannot be empty"
            }),
        });
        return schema.validate(data, { abortEarly: false });
    },
};


export const questionValidation = {
    insert: (data: QuestionModel) => {
        const schema = Joi.object({
            id: Joi.number().optional(),
            description: Joi.string().required().messages({
                "any.required": "The Questions field is required",
                "string.empty": "The School Year field is required"
            }),
            evaluationId: Joi.number().required().messages({
                "any.required": "Can't find evaluation",
                "number.empty": "Can't find evaluation"
            }),

        });
        return schema.validate(data, { abortEarly: false });
    },
    update: (data: EvaluationModel) => {
        const schema = Joi.object({
            id: Joi.number().required().messages({
                "any.required": "Opps id not found",
                "number.empty": "Opps id not found"
            }),
            description: Joi.string().required().messages({
                "any.required": "The Questions field is required",
                "string.empty": "The School Year field is required"
            }),
            evaluationId: Joi.number().required().messages({
                "any.required": "Can't find evaluation",
                "number.empty": "Can't find evaluation"
            }),

        });
        return schema.validate(data, { abortEarly: false });
    },
};



export const handleValidationError = (error: Joi.ValidationError, res: Response) => {
    appLogger.warn("Validation failed:", {
        errors: error.details.map((detail) => detail.message),
    });

    return res.status(400).json({
        message: "Validation failed",
        details: error.details.map((detail) => detail.message),
    });
};