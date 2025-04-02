import jwt from 'jsonwebtoken';
import prisma from '../prisma/index.ts';
import { TokenDetail } from '../interfaces/index.ts';


export const signInService = async (username: string, password: string) => {

    try {
        const user = await prisma.employees.findFirst({
            select: {
                id: true,
                departmentId:true,
                information: {
                    select: {
                        first_name: true,
                        last_name: true,
                        middle_name: true,
                        photo_path:true,
                        
                    }
                },
                password: true,
                role: true
            },
            where: {
                username: username,
            },

        });

        if (user) {
            // const isCorrect = await bcrypt.compare(password, user.password)

            if (password !== user.password) {
                throw new Error("Incorrect credentials");
            }
            const users = {
                id: user.id,
                first_name: user.information?.first_name || "",
                last_name: user.information?.last_name || "",
                middle_name: user.information?.middle_name || "",
                role: user.role,
                departmentId:user.departmentId || undefined,
                photo_path:user.information?.photo_path || null
            };
            const accessToken = generateAccessToken(users);
            const refreshToken = generateRefreshToken(users);

            await prisma.employees.update({
                where: {
                    id: user.id,
                },
                data: {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                },
            });
            return { users: users, token: { accessToken, refreshToken } };
        }else{
            throw new Error("Incorrect credentials");
        }
    } catch (err) {
        throw err;
    }
}


export const signOutService = async (id: number) => {
    try {
        await prisma.employees.update({
            where: {
                id: id,
            },
            data: {
                accessToken: null,
                refreshToken: null,
            },
        });
        return { message: 'Successfully Sign out' };
    } catch (err) {
        throw err;
    }
}

export const refreshTokenService = async (id: number, token: string) => {
    try {

        const user = await prisma.employees.findFirst({
            select: {
                id: true,
                departmentId:true,
                information: {
                    select: {
                        first_name: true,
                        last_name: true,
                        middle_name: true,
                        
                    }
                },
                password: true,
                role: true
            },
            where: {
                id: id,
                refreshToken: token,
            },
        });

        if (!user) {
            throw new Error("Invalid token or user not found")
        }

        const users = {
            id: user.id,
            first_name: user.information?.first_name || "",
            last_name: user.information?.last_name || "",
            middle_name: user.information?.middle_name || "",
            role: user.role,
            departmentId: user.departmentId || undefined
        };

        const accessToken = generateAccessToken(users);
        await prisma.employees.update({
            where: {
                id: user.id,
            },
            data: {
                accessToken: accessToken,
            },
        });
        return { accessToken }
    } catch (err) {
        throw err;

    }
}




const generateAccessToken = (user: TokenDetail) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '1hr' });
}

const generateRefreshToken = (user: TokenDetail) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '1d' });
}

export const validateRefreshToken = (token: string) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
}

const validateAccesToken = (token: string) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
}

