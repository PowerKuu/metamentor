import { PrismaClient } from "@prisma/client"
import crypto from "crypto"


import * as status_ from "./functions/status"
import * as chat_ from "./functions/chat"
import * as model_ from "./functions/model"
import * as user_ from "./functions/user"

import { createTransport } from "nodemailer"


export const prisma = new PrismaClient()


export const functions = { ...status_, ...chat_, ...model_, ...user_ }

export type Functions = typeof functions
export type FunctionNames = keyof Functions


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