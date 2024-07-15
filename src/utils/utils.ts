import { useLocale } from "~/locale/locale"
import type { FunctionNames, Functions } from "@/server/server"
import moment from "moment"

// Add autoimport
export { useLocale }
export type ServerFunctionResult<T extends FunctionNames> = Awaited<ReturnType<Functions[T]>> | number
export type NoServerFunctionErrors<T> = T extends number ? never : T

export async function serverFunction<T extends FunctionNames>(operation: T, ...data: Parameters<Functions[T]>): Promise<ServerFunctionResult<T>> {
    const returned = await fetch(`/api/${operation as string}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify(data)
    })

    if (!returned.ok) {
        return returned.status as ServerFunctionResult<T>
    }

    const returnedData = await returned?.json().catch(() => {})

    return returnedData as ServerFunctionResult<T>
}

export function isServerError<T>(data: T | number): data is number {
    return typeof data === "number"
}

/*
export function useJsonStorage<T>(key: string, defaultValue: T) {
    // Global computer for all storages
    const recomputer = ref(0)

    const newListener = computed<T>({
        get() {
            // Recompute when recomputer changes
            recomputer.value


            const data = localStorage.getItem(key)

            if (!data) {
                localStorage.setItem(key, JSON.stringify(defaultValue))

                return defaultValue
            }

            try {
                return JSON.parse(data) as T
            } catch (e) {
                console.error(e)

                // Reset to default value
                newListener.value = defaultValue

                return defaultValue
            }
        },
        
        set(value: T) {
            try {
                localStorage.setItem(key, JSON.stringify(value))

                recomputer.value++
            } catch (e) {
                console.error(e)
            }
        }
    })


    return newListener
}*/

export function dateFromNow(date: Date) {
    return moment(date).fromNow()
}

export function capatalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function asyncNextTick() {
    return new Promise((resolve) => {
        nextTick(() => resolve(0))
    })
}