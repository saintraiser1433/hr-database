import { EmployeeRequirements } from '@prisma/client';
import { RequirementModel } from '../interfaces/index.ts';
import prisma from '../prisma/index.ts';

export const getRequirementService = async () => {
    try {
        const response = await prisma.requirements.findMany({
            select: {
                id: true,
                title: true,
                description: true
            }
        })

        return response;
    } catch (err) {
        throw err
    }
}


export const createRequirementService = async (data: Omit<RequirementModel, "id" | "Job" | "employeeRequirements">) => {
    try {
        const response = await prisma.requirements.create({
            data
        })
        return response;
    } catch (err) {
        throw err
    }
}


export const updateRequirementService = async (id: string, data: Omit<RequirementModel, "id" | "Job">) => {
    try {
        return await prisma.requirements.update({
            where: {
                id: Number(id),
            },
            data,
        });
    } catch (err) {
        throw err;
    }
};

export const removeRequirementService = async (id: string) => {
    try {
        return await prisma.requirements.delete({
            where: {
                id: Number(id)
            }
        })
    } catch (err) {
        throw err;
    }
}



export const passRequirement = async (id: number, body: EmployeeRequirements, file: any) => {
    try {
        const response = await prisma.employeeRequirements.update({
            data: {
                fileName: file?.filename,
                status: body.status
            },
            select: {
                id:true,
                status:true,
                fileName:true
            },
            where: {
                id: id
            }
        })

        return response;
    } catch (err) {
        throw err;
    }
}





