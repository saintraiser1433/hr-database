
import { EmployeeRequirements, RequirementStatus, RoleStatus } from '@prisma/client';
import { CombinedData, EmployeeModel } from '../interfaces/index.ts';
import prisma from '../prisma/index.ts';

export const getAllEmployees = async (id: number) => {
    try {

        const response = await prisma.employees.findMany({
            select: {
                id: true,
                status: true,
                job: {
                    select: {
                        title: true,
                    },
                },


                information: {
                    select: {
                        last_name: true,
                        first_name: true,
                        middle_name: true,
                        photo_path: true,
                    }
                },
                role: true,
                username: true,
                password: true,
                createdAt: true,
            },
            where: {
                AND: [
                    {
                        departmentId: id
                    },

                ],
                OR: [
                    {
                        role: 'Employee',
                    },
                    {
                        role: 'TeamLead',
                    },


                ],



            },
            orderBy: [
                { role: 'desc' },
                { createdAt: 'desc' }
            ]
        })
        return response.map((item) => ({
            ...item,
            employeeName: `${item.information?.last_name}, ${item.information?.first_name} ${item.information?.middle_name ? `${item.information.middle_name[0]}.` : ''
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
                        fileName:true,
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
                        requirements: true,
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
                    where: {
                        id: data
                    },
                    select: {
                        id: true,
                        requirements: true,
                    }
                })
            )
        );
        const data = responses.map((item) => ({
            id: item.id,
            title: item.requirements.title
        }));
        return data;
    } catch (err) {
        throw err;
    }
}


export const modifyRequirementStatus = async (id: string, body: EmployeeRequirements) => {
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

export const getEmployeeInformationById = async (id: number) => {
    try {
        const response = await prisma.employees.findUnique({
            select: {
                username:true,
                password:true,
                status: true,
                createdAt: true,
                department: {
                    select: {
                        title: true
                    }
                },
                job: {
                    select: {
                        title: true,
                    }
                },
                information: {
                    select: {
                        first_name: true,
                        middle_name: true,
                        last_name: true,
                        gender: true,
                        date_of_birth: true,
                        email: true,
                        contact_number: true,
                        telephone_number: true,
                        permanent_address: true,
                        current_address: true,
                        religion: true,
                        language_spoken: true,
                        civil_status: true,
                        citizenship: true,
                        nickname: true,
                        resume_path: true,
                        photo_path: true,
                        fathers_name: true,
                        fathers_occupation: true,
                        mothers_name: true,
                        mothers_occupation: true,
                        parents_address: true,
                        person_to_be_contact: true,
                        education: true,
                        workExperience: true,
                        skills: true,
                        references: true
                    }
                }
            },
            where: {
                id: id
            }
        })
        if (!response) return null;
        const data = {
            status: response.status,
            applicantInfo: {
                jobTitle: response.job?.title ?? null,
                hiredDate: response.createdAt,
                department: response.department?.title ?? null, // Ensure this won't break
                first_name: response.information?.first_name ?? null,
                middle_name: response.information?.middle_name ?? null,
                last_name: response.information?.last_name ?? null,
                gender: response.information?.gender ?? null,
                date_of_birth: response.information?.date_of_birth 
                ? new Date(response.information.date_of_birth).toISOString().split('T')[0] 
                : null,
                email: response.information?.email ?? null,
                contact_number: response.information?.contact_number ?? null,
                telephone_number: response.information?.telephone_number ?? null,
                permanent_address: response.information?.permanent_address ?? null,
                current_address: response.information?.current_address ?? null,
                religion: response.information?.religion ?? null,
                civil_status: response.information?.civil_status ?? null,
                language_spoken: response.information?.language_spoken ?? null,
                citizenship: response.information?.citizenship ?? null,
                nickname: response.information?.nickname ?? null,
                resume_path: response.information?.resume_path ?? null,
                photo_path: response.information?.photo_path ?? null,
                fathers_name: response.information?.fathers_name ?? null,
                fathers_occupation: response.information?.fathers_occupation ?? null,
                mothers_name: response.information?.mothers_name ?? null,
                mothers_occupation: response.information?.mothers_occupation ?? null,
                parents_address: response.information?.parents_address ?? null,
                person_to_be_contact: response.information?.person_to_be_contact ?? null,
            },
            accountData: {
                username:response.username,
                password:response.password
            },
            educData: response.information?.education ?? null,
            workData: response.information?.workExperience ?? null,
            skillsData: response.information?.skills ?? null,
            referencesData: response.information?.references ?? null
        }

        return data;
    } catch (err) { 
        throw err;
    }
}


export const assignTeamLead = async (employeeId: number, data: EmployeeModel) => {
    try {

        const checkRole = await prisma.employees.findFirst({
            where: {
                role: RoleStatus.TeamLead,
                departmentId: data.departmentId
            }
        })

        if (checkRole) {
            throw new Error('Please unassign the previous teamlead to proceed')
        };

        const response = await prisma.employees.update({
            where: {
                id: employeeId,
                departmentId: data.departmentId
            },
            data: {
                role: RoleStatus.TeamLead
            }
        })
        return response;


    } catch (err) {
        throw err;
    }
}

export const unassignTeamlead = async (employeeId: number, data: EmployeeModel) => {
    try {
        const response = await prisma.employees.update({
            where: {
                id: employeeId,
                departmentId: data.departmentId
            },
            data: {
                role: RoleStatus.Employee
            }
        })
        return response;


    } catch (err) {
        throw err;
    }
}




export const modifyInformation = async (employeeId: number, data: CombinedData) => {
    const { educData, workData, skillsData, referencesData, applicantInfo, status } = data;

    try {

        const result = await prisma.$transaction(async (tx) => {
            // Step 1: Update Applicant Information
            const employee = await tx.employees.findUnique({
                where: { id: employeeId },
                select: { informationId: true }
            });

            if (!employee) throw new Error("Employee not found");
            await tx.employees.update({
                where: { id: employeeId },
                data: {
                    status: status
                }
            })

            const applicantInformationId = employee.informationId ?? 0;

            await tx.applicantInformation.update({
                where: { id: applicantInformationId },
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
                    parents_address: applicantInfo.parents_address,
                    person_to_be_contact: applicantInfo.person_to_be_contact,
                },
            });

            // Step 3: Process Education Data
            await processEducationData(tx, applicantInformationId, educData);

            // Step 4: Process Work Experience
            await processWorkData(tx, applicantInformationId, workData);

            // Step 5: Process Skills
            await processSkillsData(tx, applicantInformationId, skillsData);

            // Step 6: Process References
            await processReferencesData(tx, applicantInformationId, referencesData);

            return { success: true };
        });
        return result;
        // console.log("Transaction completed successfully.");
    } catch (error) {
        console.error("Transaction failed:", error);
    } finally {
        await prisma.$disconnect();
    }
};


async function processEducationData(tx: any, applicantId: number, educData: any[]) {
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
}

async function processWorkData(tx: any, applicantId: number, workData: any[]) {
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
}

async function processReferencesData(tx: any, applicantId: number, referencesData: any[]) {
    try {
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
    } catch (err) {
        throw err;
    }


}

async function processSkillsData(tx: any, applicantId: number, skillsData: any[]) {
    try {
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
    } catch (err) {
        throw err;
    }
}


export const getEmployeesCountByDeptID = async(deptId:number) => {
    try{
       const response = await prisma.employees.count({
        where:{
            departmentId: deptId
        }
       }) 

       return response;
    }catch(err){
        throw err;
    }
}





















