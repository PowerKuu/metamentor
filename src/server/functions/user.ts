import validator from "validator"
import { prisma, sendEmail, generateToken, generateVerificationCode, verifyAuth } from "../server"
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

export async function requestVerification(email: string, newUser?: {
    username: string
}) {
    if (!validator.isEmail(email)) {
        return 400
    }

    const requestedUser = await prisma.user.findFirst({
        where: {
            email
        }
    })

    let user: User | null = null

    if (!requestedUser) {
        if (!newUser) return 404

        user = await prisma.user.create({
            data: {
                email,
                token: generateToken(),
                username: newUser.username
            }
        })
    } else {
        user = requestedUser

        if (newUser){
            if (requestedUser.registered) return 409

            user = await prisma.user.update({
                where: {
                    id: requestedUser.id
                },

                data: {
                    username: newUser.username
                }
            })
        }
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

    if (!user) return 404

    if (!user.registered) {
        await prisma.user.update({
            where: {
                id: user.id
            },

            data: {
                registered: true
            }
        })
    }

    await prisma.verification.delete({
        where: {
            id: verification.id
        }
    })

    // Purge old verification codes
    purgeVerificationCodes()

    return user
}

export async function getUser(auth: string) {
    const user = verifyAuth(auth)

    if (!user) return 401

    return user
}





export async function getChats(auth: string, search?: string) {
    const user = await verifyAuth(auth)

    if (!user) return 401

    const maxSearch = 64

    const chats = await prisma.userOnChat.findMany({
        where: {
            userId: user.id,
            chat: {
                name: {
                    contains: search || undefined
                }
            }
        },

        orderBy: {
            chat: {
                createdAt: "desc"
            }
        },

        include: {
            chat: {
                include: {
                    models: true
                }
            },
        },

        take: maxSearch
    })

    console.log(chats, search)

    return chats
}

export async function getModels(auth: string, search?: string) {
    const user = await verifyAuth(auth)

    if (!user) return 401

    const maxSearch = 64

    const models = await prisma.model.findMany({
        where: {
            ownerId: user.id,
            name: {
                contains: search || undefined
            }
        },

        orderBy: {
            createdAt: "desc"
        },

        take: maxSearch
    })

    console.log(models, search)

    return models
}

export async function leaveChat(auth: string, chatId: string) {
    const user = await verifyAuth(auth)

    if (!user) return 401

    const chat = await prisma.chat.findFirst({
        where: {
            id: chatId
        }
    })

    if (!chat) return 404

    const chatUser = await prisma.userOnChat.findFirst({
        where: {
            chatId: chat.id,
            userId: user.id
        }
    })

    if (!chatUser) return 404

    return prisma.userOnChat.delete({
        where: {
            id: chatUser.id
        }
    })

}