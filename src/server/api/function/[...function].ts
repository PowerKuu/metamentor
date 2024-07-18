import { type FunctionNames, functions } from "@/server/server"

export default defineEventHandler(async (event) => {
    const operationName = event.context.params!.function as FunctionNames

    console.log(event.context.params)

    const operation: Function = functions[operationName]

    if (!operation) return setResponseStatus(event, 404)

    const bodyArgs = await readBody(event)

    if (!bodyArgs) return setResponseStatus(event, 400)

    const status = await operation(...(bodyArgs || []))
    if (typeof status === "number") return setResponseStatus(event, status)
    return status
})