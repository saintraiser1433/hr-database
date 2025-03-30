import { SMS } from '@prisma/client';
import prisma from '../prisma/index.ts';
import Client from 'android-sms-gateway';
import 'dotenv/config';
export const getSMSConfig = async () => {
    try {
        const response = await prisma.sMS.findFirst();
        return response;
    } catch (err) {
        throw err
    }
}


const httpFetchClient = {
    get: async (url: string, headers: any) => {
        const response = await fetch(url, {
            method: "GET",
            headers
        });

        return response.json();
    },
    post: async (url: string, body: any, headers: any) => {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        });

        return response.json();
    },
    delete: async (url: string, headers: any) => {
        const response = await fetch(url, {
            method: "DELETE",
            headers
        });

        return response.json();
    }
};



export const sendSMS = async (body: { message: string, phoneNumbers: string[] }) => {
    try {
        const messages = {
            phoneNumbers: body.phoneNumbers,
            message: body.message
        };
        const api = new Client(
            process.env.SMS_USERNAME ?? '',
            process.env.SMS_PASSWORD ?? '',
            httpFetchClient
        );
        const state = await api.send(messages);
        console.log('Message ID:', state.id);

        // Check status after 5 seconds
        setTimeout(async () => {
            const updatedState = await api.getState(state.id);
            console.log('Message status:', updatedState.state);
        }, 5000);

    } catch (err) {
        throw err
    }
}





export const upsertSMSConfig = async (data: SMS) => {
    try {
        const existing = await prisma.sMS.findFirst();

        if (existing) {
            return await prisma.sMS.update({
                where: { serverAddress: existing.serverAddress },
                data: {
                    serverAddress: data.serverAddress,
                    username: data.username,
                    password: data.password
                }
            });
        } else {

            return await prisma.sMS.create({
                data: {
                    serverAddress: data.serverAddress,
                    username: data.username,
                    password: data.password
                }
            });
        }
    } catch (err) {
        throw err;
    }
};










