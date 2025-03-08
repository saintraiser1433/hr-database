
import { EmployeeRequirements, RequirementStatus } from '@prisma/client';
import { CombinedData, EmployeeModel } from '../interfaces/index.ts';
import prisma from '../prisma/index.ts';

export const getAllEmployees = async (id: string) => {

    try {
        const departmentId = parseInt(id, 10);
        if (isNaN(departmentId)) throw new Error("Invalid department ID.");
        const response = await prisma.employees.findMany({
            select: {
                id: true,
                status: true,
                jobId: true,
                job: {
                    select: {
                        title: true,
                    },
                },
                department: {
                    select: {
                        title: true
                    }
                },
                information: true,
                role: true,
                username: true,
                password: true,
                createdAt: true,
                departmentId: true
            },
            where: {
                departmentId: departmentId
            },
            orderBy: [
                { status: 'asc' },
                { createdAt: 'desc' }
            ]
        })
        return response.map((item) => ({
            ...item,
            employeeName: `${item.information.last_name}, ${item.information.first_name} ${item.information.middle_name ? `${item.information.middle_name[0]}.` : ''
                }`,
        }));
    } catch (err) {
        throw err
    }
}

export const getRequirementsByEmployeeId = async (id: string) => {
    try {
        const employeeId = parseInt(id, 10);
        if (isNaN(employeeId)) throw new Error("Invalid employee ID.");
        const response = await prisma.employees.findUnique({
            where: {
                id: employeeId
            },
            select: {

                employeeRequirements: {
                    select: {
                        id: true,
                        employeeId: true,
                        submittedAt: true,
                        expiryDate: true,
                        requirementsId: true,
                        requirements: {
                            select: {
                                title: true,
                            }
                        },
                        status: true
                    }
                }
            }
        })

        const listrequirements = await prisma.requirements.findMany({
            where: {
                status: true
            }
        });
        const unchosenRequirements = listrequirements.map((item) => ({
            id: item.id,
            title: item.title
        })).filter((item) => !response?.employeeRequirements.some((req) => req.requirementsId === item.id));
        const employeeRequirements = response?.employeeRequirements.map((item) => ({
            ...item,
            requirements: item.requirements.title
        }))

        const allData = {
            employeeRequirements,
            unchosenRequirements
        }

        return allData;
    } catch (err) {
        throw err;
    }

}


export const assignEmployeeToRequirements = async (body: Omit<EmployeeRequirements, "id">[]) => {
    try {
        const responses = await Promise.all(
            body.map((data) =>
                prisma.employeeRequirements.create({
                    data,
                    select: { 
                        id: true,
                        requirements:true,
                        status: true
                     }
                })
            )
        );

        const data = responses.map((item) => ({
            ...item,
            requirements: item.requirements.title
        }));
        return data;
        // return responses; // Returns an array of created IDs

    } catch (err) {
        throw err
    }
}


export const unAssignEmployeeToRequirements = async (body: number[]) => {
    try {
  
        const responses = await Promise.all(
            body.map((data) =>
                prisma.employeeRequirements.delete({
                    where:{
                        id: data
                    },
                    select: { 
                        id: true,
                        requirements:true,
                     }
                })
            )
        );
        const data = responses.map((item) => ({
            id:item.id,
            title: item.requirements.title
        }));
        return data;
    } catch (err) {
        throw err;
    }
}


export const modifyRequirementStatus = async(id:string,body:EmployeeRequirements) => {
    try {
        const requirementId = parseInt(id, 10);
        if (isNaN(requirementId)) throw new Error("Invalid employee ID.");
        const response = await prisma.employeeRequirements.update({
            where: {
                id: requirementId
            },
            data: {
                submittedAt: body.submittedAt,
                expiryDate: body.expiryDate,
                status: body.status
            }
        });


        return response;
    } catch (err) {
        throw err;
    }
}




export const insertEmployee = async (data: Omit<EmployeeModel, 'id' | 'role'>) => {

    try {
        const response = await prisma.employees.create({
            data: {
                job: {
                    connect: { id: data.jobId }
                },
                information: {
                    connect: { id: data.informationId }
                },
                department: {
                    connect: { id: data.departmentId }
                },
                username: data.username,
                password: data.password,
            }
        })

        return response;
    } catch (err) {
        throw err;
    }

}


export const modifyInformation = async (applicantId: number, data: CombinedData) => {
    const { educData, workData, skillsData, referencesData, applicantInfo } = data;

    try {
        await prisma.$transaction(async (tx) => {
            // Step 1: Update Applicant Information
            await tx.applicantInformation.update({
                where: { id: applicantId },
                data: {
                    first_name: applicantInfo.first_name,
                    middle_name: applicantInfo.middle_name,
                    last_name: applicantInfo.last_name,
                    gender: applicantInfo.gender,
                    date_of_birth: applicantInfo.date_of_birth ? new Date(applicantInfo.date_of_birth) : null,
                    email: applicantInfo.email,
                    contact_number: applicantInfo.contact_number,
                    telephone_number: applicantInfo.telephone_number,
                    permanent_address: applicantInfo.permanent_address,
                    current_address: applicantInfo.current_address,
                    religion: applicantInfo.religion,
                    citizenship: applicantInfo.citizenship,
                    language_spoken: applicantInfo.language_spoken,
                    civil_status: applicantInfo.civil_status,
                    nickname: applicantInfo.nickname,
                    fathers_name: applicantInfo.fathers_name,
                    fathers_occupation: applicantInfo.fathers_occupation,
                    mothers_name: applicantInfo.mothers_name,
                    mothers_occupation: applicantInfo.mothers_occupation,
                    parents_current_address: applicantInfo.parents_address,
                    person_to_be_contact: applicantInfo.person_to_be_contact,
                },
            });

            // Step 2: Upsert Education Background
            for (const edu of educData) {
                if (!edu.school_name) continue; 
                await tx.educationBackground.upsert({
                    where: {
                        applicantInformationId_school_name: {
                            applicantInformationId: applicantId,
                            school_name: edu.school_name,
                        },
                    },
                    update: {
                        degree: edu.degree,
                        year_started: edu.year_started,
                        year_ended: edu.year_ended,
                        description: edu.description,
                    },
                    create: {
                        school_name: edu.school_name,
                        degree: edu.degree,
                        year_started: edu.year_started,
                        year_ended: edu.year_ended,
                        description: edu.description,
                        applicantInformationId: applicantId,
                    },
                });
            }

            // Step 3: Upsert Work Experience
            for (const work of workData) {
                if (!work.company_name) continue; 
                await tx.workExperience.upsert({
                    where: {
                        applicantInformationId_company_name: {
                            applicantInformationId: applicantId,
                            company_name: work.company_name,
                        },
                    },
                    update: {
                        job_title: work.job_title,
                        work_year_started: work.work_year_started,
                        work_year_ended: work.work_year_ended,
                    },
                    create: {
                        company_name: work.company_name,
                        job_title: work.job_title,
                        work_year_started: work.work_year_started,
                        work_year_ended: work.work_year_ended,
                        applicantInformationId: applicantId,
                    },
                });
            }

            // Step 4: Upsert Skills Expertise
            for (const skill of skillsData) {
                if (!skill.skills_name) continue; 
                await tx.skillsExpertise.upsert({
                    where: {
                        applicantInformationId_skills_name: {
                            applicantInformationId: applicantId,
                            skills_name: skill.skills_name,
                        },
                    },
                    update: {},
                    create: {
                        skills_name: skill.skills_name,
                        applicantInformationId: applicantId,
                    },
                });
            }

            // Step 5: Upsert References
            for (const ref of referencesData) {
                if (!ref.name_of_person) continue; 
                await tx.references.upsert({
                    where: {
                        applicantInformationId_name_of_person: {
                            applicantInformationId: applicantId,
                            name_of_person: ref.name_of_person,
                        },
                    },
                    update: {
                        position: ref.position,
                        ref_contact_number: ref.ref_contact_number,
                    },
                    create: {
                        name_of_person: ref.name_of_person,
                        position: ref.position,
                        ref_contact_number: ref.ref_contact_number,
                        applicantInformationId: applicantId,
                    },
                });
            }
        });

        console.log("Transaction completed successfully.");
    } catch (error) {
        console.error("Transaction failed:", error);
    } finally {
        await prisma.$disconnect();
    }
};










