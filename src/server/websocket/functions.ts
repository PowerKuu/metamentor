import type { Chat, Model, PermissionOnChat } from "@prisma/client"
import { emitWebsocket, prisma, verifyAuth, type WebSocketPeer } from "../server"

export type ChatRoomTopLevel = Chat & {
    users: {
        userId: string,
        permission: PermissionOnChat
    }[],
    
    models: Model[]
}

export type NewTemporaryModel = {
    name: string,
    description?: string,
    system: string,
    avatar: string
}

function getChatRoomTopLevelId(chatId: string) {
    return `chatRoomTopLevel:${chatId}`
}

function getChatRoomId(chatId: string) {
    return `chatRoom:${chatId}`
}

function getModelId(modelId: string) {
    return `model:${modelId}`
}

export async function subscribeAllChatRoomsTopLevel(peer: WebSocketPeer, auth: string) {
    const user = await verifyAuth(auth)

    if (!user) return

    const chats: ChatRoomTopLevel[] = await prisma.chat.findMany({
        where: {
            users: {
                some: {
                    userId: user.id
                }
            }
        },

        include: {
            users: {
                select: {
                    userId: true,
                    permission: true
                }
            },
            models: true
        }
    })

    if (!chats) return

    for (const chat of chats) {
        peer.subscribe(
            getChatRoomTopLevelId(chat.id)
        )
    }

    emitWebsocket(peer, "editChatTopLevel", null, chats)
}


export async function unsubscribeAllChatRoomsTopLevel(peer: WebSocketPeer, auth: string) {
    const user = await verifyAuth(auth)

    if (!user) return

    // More efficient to query for userOnChats directly

    const userOnChats = await prisma.userOnChat.findMany({
        where: {
            userId: user.id
        },

        include: {
            chat: true
        }
    })

    if (!userOnChats) return

    for (const userOnChat of userOnChats) {
        peer.unsubscribe(
            getChatRoomTopLevelId(userOnChat.chatId)
        )
    }

    emitWebsocket(peer, "editChatTopLevel", null, [])
}



export async function subscribeChatRoom(peer: WebSocketPeer, auth: string, chatId: string) {
    const user = await verifyAuth(auth)

    if (!user) return

    const userOnChat = await prisma.userOnChat.findFirst({
        where: {
            chatId: chatId,
            userId: user.id 
        }
    })

    if (!userOnChat) return

    peer.subscribe(
        getChatRoomId(chatId)
    )
}


export async function unsubscribeChatRoom(peer: WebSocketPeer, chatId: string) {
    peer.unsubscribe(
        getChatRoomId(chatId)
    )
}






export async function editChat(peer: WebSocketPeer, auth: string, {
    id,
    name
}: Partial<Chat>, selectedModels: string[]) {
    const maxName = 64

    const user = await verifyAuth(auth)

    if (!user) return 401

    if (name && name.length > maxName) return 413

    const existingModel = await prisma.chat.findFirst({
        where: {
            id,
            
            users: {
                some: {
                    userId: user.id,
                    permission: {
                        in: ["OWNER", "WRITE"]
                    }
                }
            }
        }
    })

    if (!existingModel) return 404

    const newChat = await prisma.chat.update({
        where: {
            id
        },

        data: {
            name: name,

            models: {
                set: selectedModels?.map(model => ({
                    id: model
                }))
            }
        },

        include: {
            users: {
                select: {
                    userId: true,
                    permission: true
                }
            },
            models: true
        }
    })

    await emitWebsocket(peer, "editChatTopLevel", getChatRoomTopLevelId(newChat.id), [newChat])
}

export async function createChat(peer: WebSocketPeer, auth: string, name: string, newModels: NewTemporaryModel[]) {
    const maxName = 64

    const user = await verifyAuth(auth)

    if (!user) return 401

    if (name && name.length > maxName) return 413

    for (const model of newModels) {
        if (model.name.length > 64) return 413
        if (model.system.length > 64) return 413
        if (model.avatar.length > 64) return 413
    }


    const newChat = await prisma.chat.create({
        data: {
            name: name,

            models: {
                create: newModels.map(model => ({
                    avatar: model.avatar,
                    name: model.name,
                    description: model.description,
                    system: model.system
                }))
            }
        },

        include: {
            users: {
                select: {
                    userId: true,
                    permission: true
                }
            },
            models: true
        }
    })

    await emitWebsocket(peer, "editChatTopLevel", getChatRoomTopLevelId(newChat.id), [newChat])
}



export async function sendMessage(peer: WebSocketPeer, auth: string, chatId: string, message: string) {
    const user = await verifyAuth(auth)

    if (!user) return

    const userOnChat = await prisma.userOnChat.findFirst({
        where: {
            chatId: chatId,
            userId: user.id
        }
    })

    if (!userOnChat) return

    const newMessage = await prisma.message.create({
        data: {
            sentByUser: {
                connect: {
                    id: userOnChat.id
                }
            },
            text: message
        }
    })

    await emitWebsocket(peer, "newChatMessage", getChatRoomId(chatId), chatId, newMessage)
}