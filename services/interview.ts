import { InterviewDate } from '../interfaces';
import prisma from '../prisma';
import { parseISO } from 'date-fns';
export const updateInterviewDate = async (id: string, date:string) => {
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










