import type { FunctionNames, Functions, WebSocketEmitterNames, WebSocketEmitters, WebSocketFunctionNames, WebSocketFunctions } from "@/server/server"
import type { UseWebSocketReturn } from "@vueuse/core"

export type StripError<T> = T extends number ? never : T

export function isServerError<T>(data: T | number): data is number {
    return typeof data === "number"
}

export type ServerFunctionResponse<T extends FunctionNames> = Awaited<ReturnType<Functions[T]>> | number
export type ServerFunctionData<T extends FunctionNames> = StripError<ServerFunctionResponse<T>>

export async function serverFunction<T extends FunctionNames>(operation: T, ...data: Parameters<Functions[T]>): Promise<ServerFunctionResponse<T>> {
    const returned = await fetch(`/api/function/${operation as string}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify(data)
    })

    if (!returned.ok) {
        return returned.status as ServerFunctionResponse<T>
    }

    const returnedData = await returned?.json().catch(() => {})

    return returnedData as ServerFunctionResponse<T>
}

type ParametersExceptFirst<T> = T extends (first: any, ...rest: infer P) => any ? P : never

export async function webscoketFunction<T extends WebSocketFunctionNames>(websocket: WebSocket, operation: T, ...data: ParametersExceptFirst<WebSocketFunctions[T]>) {
    websocket.send(JSON.stringify({
        operation,
        data
    }))
}

export async function webscoketListener<T extends WebSocketEmitterNames>(websocket: WebSocket, listener: T, callback: (...data: Parameters<WebSocketEmitters[T]>) => void) {
    websocket.addEventListener("message", (event) => {
        const {
            operation,
            data
        }: {
            operation: WebSocketEmitterNames
            data: Parameters<WebSocketEmitters[T]>
        } = JSON.parse(event.data)

        if (operation === listener) {
            callback(...data)
        }
    })
}