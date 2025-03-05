
import { ScreeningStatus } from '@prisma/client';
import prisma from '../prisma';
import { parseISO } from 'date-fns';
export const updateInterviewDate = async (id: string, date: string) => {
    try {

        const apResultId = parseInt(id, 10);
        if (isNaN(apResultId)) throw new Error("Invalid applicant ID.");

        // Ensure the date format includes seconds and timezone
        const interviewDate = parseISO(date);
        if (isNaN(interviewDate.getTime())) throw new Error("Invalid date format.");
        const response = await prisma.applicantScreeningResult.update({
            where: {
                id: apResultId
            },
            data: {
                dateInterview: interviewDate
            }
        })

        const datafinal = {
            id: response.id,
            date: response.dateInterview
        }


        return datafinal;
    } catch (err) {
        throw err
    }
}


export const updateInterviewStatus = async (id: string, status: ScreeningStatus) => {
    try {
        const apResultId = parseInt(id, 10);
        if (isNaN(apResultId)) throw new Error("Invalid applicant ID.");

        // Fetch the current record
        const currentRecord = await prisma.applicantScreeningResult.findUnique({
            where: { id: apResultId }
        });
        if (!currentRecord) throw new Error("Record not found.");

        if (currentRecord.sequence_number > 1) {
            const previousRecord = await prisma.applicantScreeningResult.findFirst({
                where: {
                    applicantId: currentRecord.applicantId,
                    sequence_number: currentRecord.sequence_number - 1
                }
            });

            if (!previousRecord || previousRecord.dateInterview === null || previousRecord.status === 'PENDING') {
                throw new Error("Cannot update status. Previous Sequence INTERVIEW DATE is not assign or status is NOT RATED");
            }
        }

        // Update status
        const response = await prisma.applicantScreeningResult.update({
            where: { id: apResultId },
            data: { status }
        });

        return {
            id: response.id,
            status: response.status
        };
    } catch (err) {
        throw err;
    }
};










