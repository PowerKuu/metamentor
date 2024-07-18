type Peer = Parameters<NonNullable<Parameters<typeof defineWebSocket>[0]["open"]>>[0]

export function subscribeChatRoomSurface(peer: Peer, auth: string, chatId: string) {
    
}

export function subscribeChatRoom(peer: Peer, auth: string, chatId: string) {
    
}