
import prisma from "../prisma/index.ts";

export const getAllSummary = async () => {
    try {
      const summary = await prisma.$transaction([
        prisma.departments.count(),
        prisma.employees.count(),
        prisma.applicant.count(),
        prisma.job.count(),
        // Add counts for other models if needed
      ]);
  
      return {
        departmentsCount: summary[0],
        employeesCount: summary[1],
        applicantsCount: summary[2],
        jobsCount: summary[3],
        // Add other counts here
      };
    } catch (err) {
      throw err;
    }
  };



