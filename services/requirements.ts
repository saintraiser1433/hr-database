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
                status: body.status,
                isSended: false
            },
            select: {
                id: true,
                status: true,
                fileName: true
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

export const checkExpiredRequirements = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to 00:00:00

        const sevenDaysLater = new Date(today);
        sevenDaysLater.setDate(today.getDate() + 7); // Today + 7 days

        const response = await prisma.employeeRequirements.findMany({
            select: {
                id: true,
                employee: {
                    select: {
                        information: {
                            select: {
                                first_name: true,
                                last_name: true,
                                contact_number: true,
                            }
                        }
                    }
                },
                requirements: {
                    select: {
                        title: true,

                    }
                },

                expiryDate: true
            },
            where: {
                expiryDate: {
                    gte: today,
                    lte: sevenDaysLater,

                },
                isSended: false,
                status: 'SUBMITTED'
            }
        });

        const transformData = response.map((item) => {
            const fullname = `${item.employee.information?.last_name} ${item.employee.information?.first_name}`
            return {
                id: item.id,
                fullname,
                requirements: item.requirements.title,
                expiryDate: item.expiryDate,
                contact_number: item.employee.information?.contact_number
            }

        })

        return transformData;
    } catch (err) {
        throw err;
    }
}

export const markRequirementAsSent = async (id: number) => {
    try {
        await prisma.employeeRequirements.update({
            where: { id },
            data: { isSended: true }
        });
        return { success: true };
    } catch (error) {
        throw error;
    }
};


export const updateExpiredRequirements = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. First find all requirements that are expiring
        const expiredRequirements = await prisma.employeeRequirements.findMany({
            where: {
                expiryDate: {
                    lt: today
                },
                status: { not: 'EXPIRED' }
            },
            include: {
                employee: {
                    include: {
                        information: true
                    }
                },
                requirements: true
            }
        });

        // 2. Generate messages for each expired document
        const messages = expiredRequirements.map(req => {
            const employeeName = `${req.employee.information?.first_name} ${req.employee.information?.last_name}`;
            const docName = req.requirements.title;
            const expiredDate = req.expiryDate?.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) || 'unknown date';

            return {
                employeeId: req.employeeId,
                contactNumber: req.employee.information?.contact_number,
                message: `Dear ${employeeName},\n\n` +
                    `Important Notice from SEAIT HR:\n` +
                    `Your ${docName} has expired on ${expiredDate}.\n` +
                    `Please submit an updated document immediately to avoid any inconvenience.\n\n` +
                    `Thank you,\nSEAIT HR Department`
            };
        });


        const updateResult = await prisma.$transaction([
            prisma.employeeRequirements.updateMany({
                where: {
                    id: {
                        in: expiredRequirements.map(req => req.id)
                    }
                },
                data: {
                    status: 'EXPIRED',
                    expiryDate: null,
                    submittedAt: null,
                    fileName: null
                }
            }),
            // You could add additional operations here if needed
        ]);

        return {
            success: true,
            message: `Processed ${expiredRequirements.length} expired documents`,
            count: expiredRequirements.length,
            messages, // Array of messages to be sent
            updatedAt: new Date()
        };

    } catch (err) {

        return {
            success: false,
            message: 'Failed to process expired requirements',
            error: err instanceof Error ? err.message : 'Unknown error'
        };
    }
}







