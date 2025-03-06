import { DepartmentModel, RequirementModel } from '../interfaces/index.ts';
import prisma from '../prisma/index.ts';

export const getDepartmentService = async () => {
    try {
        const response = await prisma.departments.findMany({
            select: {
                id: true,
                title: true,
                status: true
            },
            orderBy:{
                title: 'asc'
            }
        })

        return response;
    } catch (err) {
        throw err
    }
}




export const createDepartmentService = async (data: DepartmentModel) => {
    try {
        const response = await prisma.departments.create({
            data
        })
        return response;
    } catch (err) {
        throw err
    }
}






export const updateDepartmentService = async (id: string, data: DepartmentModel) => {
    return await prisma.departments.update({
        where: {
            id: Number(id),
        },
        data,
    });
};

export const removeDepartmentService = async (id: string) => {
    return await prisma.departments.delete({
        where: {
            id: Number(id)
        }
    })
}






