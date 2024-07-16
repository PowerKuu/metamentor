import type { Chat } from "@prisma/client"
import { prisma, verifyAuth } from "../server"

export async function createChat(chat: Chat) {
    
}

export async function getChats(auth: string) {
    const user = await verifyAuth(auth, {
        chats: {
            include: {
                chat: true
            }
        }
    })

    if (!user) return 401

    return user.chats
}