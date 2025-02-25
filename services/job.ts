import { JobModel, RequirementModel } from '../types';
import prisma from '../prisma';

export const getJobService = async () => {
    try {
        const response = await prisma.job.findMany({
            include: {
                department: true
            }
        })

        return response;
    } catch (err) {
        throw err
    }
}



export const createJobService = async (body: Omit<JobModel, "id" | "JobScreening">, file: any) => {
    try {
        const response = await prisma.job.create({
            data: {
                title: body.title,
                description: body.description,
                totalAvailable: Number(body.totalAvailable),
                headerImage: file?.filename || body.headerImage,
                department: {
                    connect: { id: Number(body.departmentsId), }, // 🔹 Connects this job to department with ID = 2
                },
            },
            include: {
                department: true, // ✅ Include department data in response
            },

        })



        const finalData = {
            ...response,
            departmentTitle: response.department.title
        }

        return finalData;
    } catch (err) {
        throw err
    }
}


export const updateJobService = async (id: string, body: Omit<JobModel, "JobScreening">, file: any) => {



    const response = await prisma.job.update({
        where: {
            id: Number(id),
        },
        data: {
            title: body.title,
            description: body.description,
            totalAvailable: Number(body.totalAvailable),
            headerImage: file?.filename || body.headerImage,
            status: String(body.status) === "true",
            department: {
                connect: { id: Number(body.departmentsId) },
            },
        },
        include: {
            department: true
        }




    });

    const finalData = {
        ...response,
        departmentTitle: response.department.title
    }

    return finalData
};

export const removeJobService = async (id: string) => {
    return await prisma.job.delete({
        where: {
            id: Number(id)
        }
    })
}






