import Joi from 'joi';
import { Response } from 'express';
import { ApplicantInformationModel, DepartmentModel, EvaluationModel, JobModel, JobScreeningModel, QuestionModel, RequirementModel, ScreeningModel } from '../interfaces/index.ts';
import { appLogger } from './logger.ts';
import { EmployeeRequirements, Peer, Question, TemplateDetail, TemplateHeader } from '@prisma/client';

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
            requirements: Joi.array().items(Joi.number()).optional().messages({
                "array.base": "Requirements must be an array",
                "array.includes": "Each requirement must be a number"
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
            requirements: Joi.array().items(Joi.number()).optional().messages({
                "array.base": "Requirements must be an array",
                "array.includes": "Each requirement must be a number"
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

export const assignEmpToRequirements = {
    assign: (data: EmployeeRequirements) => {
        const schema = Joi.array().items(
            Joi.object({
                id: Joi.number().optional(),
                employeeId: Joi.number().required().messages({
                    "any.required": "The Employee field is required",
                    "number.base": "The Employee field must be a number",
                }),
                requirementsId: Joi.number().required().messages({
                    "any.required": "The Requirements field is required",
                    "number.base": "The Requirements field must be a number",
                }),
                status: Joi.string().optional()
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


export const applicantsValidation = {
    insert: (data: ApplicantInformationModel) => {
        const schema = Joi.object({
            id: Joi.number().optional(),
            jobId: Joi.number().required().messages({
                "any.required": "The Job field is required",
                "string.empty": "The Job field cannot be empty"
            }),
            first_name: Joi.string().required().messages({
                "any.required": "The First Name field is required",
                "string.empty": "The First Name field cannot be empty"
            }),
            middle_name: Joi.string().optional(),
            last_name: Joi.string().required().messages({
                "any.required": "The Last Name field is required",
                "string.empty": "The Last Name field cannot be empty"
            }),
            email: Joi.string().email().required().messages({
                "any.required": "The Email field is required",
                "string.email": "Invalid email format"
            }),
            contact_number: Joi.string().required().messages({
                "any.required": "The Contact Number field is required",
                "number.base": "The Contact Number must be a number"
            }),
            resume_path: Joi.string().required().messages({
                "any.required": "The Resume Path field is required"
            }),

            gender: Joi.string().optional(),
            age: Joi.number().optional(),
            civil_status: Joi.string().optional(),
            date_of_birth: Joi.string().optional(),
            city_address: Joi.string().optional(),
            provincial_address: Joi.string().optional(),
            telephone_number: Joi.number().optional(),
            religion: Joi.string().optional(),
            citizenship: Joi.string().optional(),
            fathers_name: Joi.string().optional(),
            fathers_occupation: Joi.string().optional(),
            mothers_name: Joi.string().optional(),
            mothers_occupation: Joi.string().optional(),
            parents_address: Joi.string().optional(),
            person_to_be_contact: Joi.string().optional(),

            // Educational Background
            elementary: Joi.string().optional(),
            elementary_years_attended: Joi.string().optional(),
            highschool: Joi.string().optional(),
            highschool_years_attended: Joi.string().optional(),
            college: Joi.string().optional(),
            college_years_attended: Joi.string().optional(),

            // Relationships
            // applicantId: Joi.number().required().messages({
            //     "any.required": "The Applicant ID field is required",
            //     "number.base": "The Applicant ID must be a number"
            // })
        });
        return schema.validate(data, { abortEarly: false });
    },

    update: (data: ApplicantInformationModel) => {
        const schema = Joi.object({
            id: Joi.number().required().messages({
                "any.required": "The ID field is required",
                "number.base": "The ID field must be a number"
            }),
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            email: Joi.string().email().required(),
            contact_number: Joi.number().required(),
            resume_path: Joi.string().required(),

            gender: Joi.string().optional(),
            age: Joi.number().optional(),
            civil_status: Joi.string().optional(),
            date_of_birth: Joi.string().optional(),
            city_address: Joi.string().optional(),
            provincial_address: Joi.string().optional(),
            telephone_number: Joi.number().optional(),
            religion: Joi.string().optional(),
            citizenship: Joi.string().optional(),
            fathers_name: Joi.string().optional(),
            fathers_occupation: Joi.string().optional(),
            mothers_name: Joi.string().optional(),
            mothers_occupation: Joi.string().optional(),
            parents_address: Joi.string().optional(),
            person_to_be_contact: Joi.string().optional(),

            // Educational Background
            elementary: Joi.string().optional(),
            elementary_years_attended: Joi.string().optional(),
            highschool: Joi.string().optional(),
            highschool_years_attended: Joi.string().optional(),
            college: Joi.string().optional(),
            college_years_attended: Joi.string().optional(),

            // Relationships
            applicantId: Joi.number().required()
        });
        return schema.validate(data, { abortEarly: false });
    }
};





export const questionValidation = {
    insert: (data: Question) => {
        const schema = Joi.object({
            id: Joi.number().optional(),
            question: Joi.string().required().messages({
                "any.required": "The Questions field is required",
                "string.empty": "The Question  field is required"
            }),
            peerId: Joi.number().required().messages({
                "any.required": "Can't find peer ID",
                "number.empty": "Can't find peer ID"
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
            question: Joi.string().required().messages({
                "any.required": "The Questions field is required",
                "string.empty": "The School Year field is required"
            }),
            peerId: Joi.number().required().messages({
                "any.required": "Can't find peer ID",
                "number.empty": "Can't find peer ID"
            }),

        });
        return schema.validate(data, { abortEarly: false });
    },
};


export const peerCategoryValidation = {
    validate: (data: Peer) => {
        const schema = Joi.object({
            id: Joi.number().optional(),
            title: Joi.string().required().messages({
                "any.required": "The Title field is required",
                "string.base": "The Title field must be a string",
            }),
            evaluationId: Joi.number().required().messages({
                "any.required": "The Evaluation field is required",
                "number.base": "The Evaluation field must be a number",
            }),
            // templateHeaderId: Joi.number().required().messages({
            //     "any.required": "Please select template first before adding category",
            //     "number.empty": "Please select template first before adding category"
            // }),
        })
        return schema.validate(data, { abortEarly: false });
    },
};


export const templateValidation = {
    insert: (data: TemplateHeader) => {
        const schema = Joi.object({
            id: Joi.number().optional(),
            template_name: Joi.string().required().messages({
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
    update: (data: TemplateHeader) => {
        const schema = Joi.object({
            id: Joi.number().required().messages({
                "any.required": "The ID field is required",
                "number.base": "The ID field must be a number"
            }),
            template_name: Joi.string().required().messages({
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

export const templateDetailValidation = {
    insert: (data: TemplateDetail) => {
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
            score: Joi.number().required().messages({
                "any.required": "The score field is required",
                "string.empty": "The score field cannot be empty"
            }),
            templateId: Joi.number().required().messages({
                "any.required": "The template header id field is required",
                "string.empty": "The template header id field cannot be empty"
            }),
        });
        return schema.validate(data, { abortEarly: false });
    },
    update: (data: TemplateDetail) => {
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
            score: Joi.number().required().messages({
                "any.required": "The score field is required",
                "string.empty": "The score field cannot be empty"
            }),
            templateId: Joi.number().required().messages({
                "any.required": "The template header id field is required",
                "string.empty": "The template header id field cannot be empty"
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