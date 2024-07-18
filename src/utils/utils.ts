import type { FunctionNames, Functions } from "@/server/server"
import moment from "moment"


// Add autoimport
export type NormalizePartial<T> = { [P in keyof T]?: NonNullable<T[P]> | undefined }

export function normalizePartial<T>(data: T) {
    for (const key in data) {
        if (data[key] === null) {
            delete data[key]
        }
    }

    return data as NormalizePartial<T>
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