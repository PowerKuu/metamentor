import { PrismaClient } from "@prisma/client"
import crypto from "crypto"


import * as status_ from "./functions/status"
import * as chat_ from "./functions/chat"
import * as model_ from "./functions/model"
import * as user_ from "./functions/user"

import * as websocketChat_ from "./websocket/functions"
import * as websocketEmitters_ from "./websocket/emitters"


import { createTransport } from "nodemailer"


export const prisma = new PrismaClient()

export const functions = { ...status_, ...chat_, ...model_, ...user_ }
export const webscoketFunctions = { ...websocketChat_ }
export const websocketEmitters = { ...websocketEmitters_ }

export type Functions = typeof functions
export type FunctionNames = keyof Functions

export type WebSocketFunctions = typeof webscoketFunctions
export type WebSocketFunctionNames = keyof WebSocketFunctions

export type WebSocketEmitters = typeof websocketEmitters
export type WebSocketEmitterNames = keyof WebSocketEmitters

export type WebSocketPeer = Parameters<NonNullable<Parameters<typeof defineWebSocket>[0]["open"]>>[0]



export function generateToken() {
    return crypto.randomBytes(32).toString("hex")
}

export function generateUUID() {
    return crypto.randomBytes(16).toString("hex")
}

export function generateVerificationCode() {
    return crypto.randomBytes(4).toString("hex")
}

const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

export async function sendEmail(email: string, subject: string, body: string) {
    return transporter.sendMail({
        to: email,
        subject,
        text: body
    })
}

export async function verifyAuth(token: string) {
    return prisma.user.findUnique({
        where: {
            token
        }
    })
}

export async function emitWebsocket<T extends WebSocketEmitterNames>(peer: WebSocketPeer, operation: T, topic: string | null, ...data: Parameters<WebSocketEmitters[T]>) {
    if (topic) {
        peer.publish(topic, {
            operation,
            data
        })
    } else {
        peer.send({
            operation,
            data
        })
    }
}