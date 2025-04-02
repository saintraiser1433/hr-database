import { ApplicantInformation, EducationBackground, EmployeeRequirements, References, RoleStatus, SkillsExpertise, TemplateDetail, WorkExperience } from "@prisma/client";
import { ApplicationStatus, StatusesEvaluation } from "../types/index.ts";

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

export interface AssignPeerEvaluations {
    academicYearId: number;
    departmentId: number;
    peersToEvaluate: number;
}

export interface ApplicantModel extends ApplicantInformationModel {
    id: number;
    jobId: number;
    status: ApplicationStatus;
    createdAt: Date;
    updatedAt: Date;
    // Relationships
    jobApply: JobModel;
}

export interface PasswordModel { 
    newPassword:string;
    oldPassword:string
}



export interface ApplicantInformationModel {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    contact_number: string;
    resume_path: string;
    photo_path: string;
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

    elementary?: string;
    elementary_years_attended?: string;
    highschool?: string;
    highschool_years_attended?: string;
    college?: string;
    college_years_attended?: string;

    Applicant?: ApplicantModel
    applicantId?: number
}


export interface EmployeeModel {
    id: number;
    status: boolean;
    jobId: number;
    departmentId: number;
    informationId: number;
    username: string;
    password: string;
    accessToken?: string | null;
    refreshToken?: string | null;
    role: RoleStatus;
    createdAt: Date;
    updatedAt: Date;
    employeeRequirements: EmployeeRequirements[];
}





export interface InterviewDate {
    id: number,
    date: string
}

export interface CombinedData {
    status: boolean,
    applicantInfo: ApplicantInformation,
    educData: EducationBackground[],
    referencesData: References[],
    skillsData: SkillsExpertise[],
    workData: WorkExperience[]
}

export interface TokenDetail {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string;
    role: string;
    departmentId?: number;
}

export interface EvaluateSubmission {
    evaluationId: number;
    teamLeadEvaluationId: number;
    questionId: number;
    templateDetailId: number;
    employeesId: number;
}



export interface EmployeeRating {
    peerEvalId?: number;
    employeeId: number;
    name: string;
    departmentId: number;
    departmentName?: string;
    photo_path?: string;
    template: TemplateDetail[],
    rating: {
        categoryName: string;
        percentage: number;
        ratingPercentage: number | null;
        totalScore: number;
        totalPossibleScore: number;
        averageRating?: number;
    }[],
    categoryCounts: {
        Category: string; // Explicitly allow `Category` to be a string
        [key: string]: number | string; // Allow other keys to be numbers or strings
    }[],
    answersData: {
        questionId: number;
        category: string;
        criteria?:string;
        question: string;
        templateDetailId: number;
        templateDetailTitle: string;
        templateDetailScore: number;
    }[],
    comment: string;
    evaluatedBy: string;
    summaryRating?: {
        rating: number;
        adjectiveRating: string;
    };
}
