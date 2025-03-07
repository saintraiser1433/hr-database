
import { EmployeeRequirements, RequirementStatus } from '@prisma/client';
import { EmployeeModel } from '../interfaces/index.ts';
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









