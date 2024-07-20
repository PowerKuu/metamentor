import type { WebSocketFunctionNames, WebSocketFunctions } from "~/server/server"
import { webscoketFunctions } from "~/server/server"


export default defineWebSocketHandler({
    open(peer) {
        console.log("open")
    },
    async message(peer, message) {
        console.log(message.text())
        const messageJSON = JSON.parse(message.text())

        const operationName: WebSocketFunctionNames = messageJSON.operation
        const operation: Function = webscoketFunctions[operationName]

        const data = messageJSON.data

        if (!operation || !data) return
        
        await operation(peer, ...(data || []))
    },
})