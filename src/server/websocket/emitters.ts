import type { Chat, Message, Model, UserOnChat } from "@prisma/client"

export function newChatMessage(chatId: string, message: Message) {
    
}

export function chatSurface(chat: (UserOnChat & {
    chat: Chat
})[]) {

}