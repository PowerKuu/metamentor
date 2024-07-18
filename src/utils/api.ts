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

export async function webscoketFunction<T extends WebSocketFunctionNames>(websocket: UseWebSocketReturn, operation: T, ...data: Parameters<WebSocketFunctions[T]>) {
    websocket.send(JSON.stringify({ operation, data }))
}
