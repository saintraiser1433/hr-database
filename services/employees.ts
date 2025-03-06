
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
                job: {
                    select: {
                        requirements: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                status: true
                            }
                        }
                    }
                }
            }
        })
        return response?.job?.requirements || [];
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









