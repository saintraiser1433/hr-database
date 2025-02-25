import Joi from 'joi';
import { Response } from 'express';
import { DepartmentModel, JobModel, RequirementModel, ScreeningModel } from '../types';
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



export const handleValidationError = (error: Joi.ValidationError, res: Response) => {
    appLogger.warn("Validation failed:", {
        errors: error.details.map((detail) => detail.message),
    });

    return res.status(400).json({
        message: "Validation failed",
        details: error.details.map((detail) => detail.message),
    });
};