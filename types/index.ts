export interface Timestamped {
    createdAt?: Date;
    updatedAt?: Date;
}
export interface RequirementModel extends Timestamped {
    id: number;
    title: string;
    description: string;
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
    status?: statusesEvaluation;
    questionList?: QuestionModel[];
}

type statusesEvaluation = "NOT SET" | "ONGOING" | "FINISHED";

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