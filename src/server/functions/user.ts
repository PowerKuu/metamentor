import validator from "validator"
import { prisma, sendEmail, generateToken, generateVerificationCode } from "../server"
import type { User } from "@prisma/client"

async function purgeVerificationCodes() {
    const expiryTime = 1000 * 60 * 60 // 1 hour ago

    return prisma.verification.deleteMany({
        where: {
            createdAt: {
                lt: new Date(Date.now() - expiryTime)
            }
        }
    })
}

export async function requestVerification(email: string, username?: string) {
    if (!validator.isEmail(email)) {
        return 400
    }

    const requestedUser = await prisma.user.findFirst({
        where: {
            email
        }
    })

    let user: User | null = null

    if (!requestedUser && username) {
        user = await prisma.user.create({
            data: {
                email,
                token: generateToken(),
                username
            }
        })
    } else {
        user = requestedUser
    }



    if (!user) return 404

    const emailVerification = await prisma.verification.create({
        data: {
            email,
            code: generateVerificationCode(),
            user: {
                connect: {
                    id: user.id
                }
            }
        }
    })

    sendEmail(email, "Verification Code", emailVerification.code)

    // Purge old verification codes
    purgeVerificationCodes()


}

export async function verify(email: string, code: string) {
    if (!validator.isEmail(email)) {
        return 400
    }

    const verification = await prisma.verification.findFirst({
        where: {
            email,
            code
        }
    })

    if (!verification) return 401

    const user = await prisma.user.findUnique({
        where: {
            id: verification.userId
        }
    })

    if (!user?.registered) {
        return 403
    }

    if (!user) return 401

    return user
}

export async function getUser(token: string) {
    const user = await prisma.user.findUnique({
        where: {
            token
        }
    })

    if (!user) return 401

    return user
}