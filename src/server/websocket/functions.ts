import { emitWebsocket, prisma, verifyAuth, websocketEmitters, type WebSocketPeer } from "../server"


function getChatRoomSurfaceId(chatId: string) {
    return `chatRoomSurface:${chatId}`
}

function getChatRoomId(chatId: string) {
    return `chatRoom:${chatId}`
}

export async function subscribeMultipleChatRoomsSurfaces(peer: WebSocketPeer, auth: string, chatIds: string[]) {
    const user = await verifyAuth(auth)

    if (!user) return

    const userOnChats = await prisma.userOnChat.findMany({
        where: {
            userId: user.id,
            chatId: {
                in: chatIds
            }
        },

        include: {
            chat: true
        }
    })

    if (!userOnChats) return

    for (const userOnChat of userOnChats) {
        peer.subscribe(
            getChatRoomSurfaceId(userOnChat.chatId)
        )
    }

    emitWebsocket(peer, "chatSurface", null, userOnChats)
}


export async function unsubscribeMultipleChatRoomSurfaces(peer: WebSocketPeer, chatIds: string[]) {
    for (const chatId of chatIds) {
        peer.unsubscribe(
            getChatRoomSurfaceId(chatId)
        )
    }
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






export async function chatSurface(peer: WebSocketPeer, auth: string, chatId: string) {
    const user = await verifyAuth(auth)

    if (!user) return

    const userOnChat = await prisma.userOnChat.findFirst({
        where: {
            chatId: chatId,
            userId: user.id,

            permission: {
                in: ["WRITE", "OWNER"]
            }
        },

        include: {
            chat: true
        }
    })

    if (!userOnChat) return

    await emitWebsocket(peer, "chatSurface", getChatRoomSurfaceId(chatId), [userOnChat])
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