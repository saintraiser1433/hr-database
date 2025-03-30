// export type statusesEvaluation = "NOT_SET" | "ONGOING" | "FINISHED";

export enum StatusesEvaluation {
    NOTSET = "NOT_SET",
    ONGOING = "ONGOING",
    FINISHED = "FINISHED",
}



export enum ApplicationStatus {
    PENDING = "PENDING",
    ONGOING = "ONGOING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export enum WebHookEventType {
    SmsReceived = "sms:received",
    SystemPing = "system:ping"
}