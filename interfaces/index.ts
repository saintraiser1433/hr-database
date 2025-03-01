import { ApplicationStatus, StatusesEvaluation } from "../types";

export interface Timestamped {
    createdAt?: Date;
    updatedAt?: Date;
}
export interface RequirementModel extends Timestamped {
    id: number;
    title: string;
    description: string;
    status: boolean
    job?: JobModel[]
}



export interface JobModel extends Timestamped {
    id: number;
    title: string;
    description: string;
    totalAvailable: number;
    status?: boolean;
    departmentsId: number,
    department?: DepartmentModel
    headerImage?: string;
    requirementsId: number[];
    JobScreening?: JobScreeningModel[];
    requirements?: RequirementModel[]
}

export interface ScreeningModel {
    id: number;
    title: string;
    description: string;
    status?: boolean;
    JobScreening?: JobScreeningModel[];
}

export interface JobScreeningModel extends Timestamped {
    job_id: number;
    screening_id: number;
    jobList?: JobModel;
    sequence_number: number;
    screeningList?: ScreeningModel;
}

export interface DepartmentModel {
    id: number;
    title: string;
    status?: boolean;
}

export interface EvaluationModel extends Timestamped {
    id: number;
    school_year: string;
    semester: number;
    status?: StatusesEvaluation;
    questionList?: QuestionModel[];
}


export interface QuestionModel {
    id: number;
    question: string;
    evaluationId?: number;
    Evaluation?: EvaluationModel;
}

export interface CommentsModel {
    id: number;
    description: string;
}

export interface ApplicantModel extends ApplicantInformationModel {
    id: number;
    jobId: number;
    status: ApplicationStatus;
    createdAt: Date;
    updatedAt: Date;
    // Relationships
    jobApply: JobModel;
    ApplicantInformation: ApplicantInformationModel[];
}



export interface ApplicantInformationModel {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    contact_number: number;
    resume_path: string;

    gender?: string;
    age?: number;
    civil_status?: string;
    date_of_birth?: string;
    city_address?: string;
    provincial_address?: string;
    telephone_number?: number;
    religion?: string;
    citizenship?: string;
    fathers_name?: string;
    fathers_occupation?: string;
    mothers_name?: string;
    mothers_occupation?: string;
    parents_address?: string;
    person_to_be_contact?: string;

    // Educational Background
    elementary?: string;
    elementary_years_attended?: string;
    highschool?: string;
    highschool_years_attended?: string;
    college?: string;
    college_years_attended?: string;

    // Relationships
    Applicant: ApplicantModel
    applicantId: number
}
