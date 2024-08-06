import moment from "moment"


// Add autoimport
export type NormalizedPartial<T> = { [P in keyof T]?: NonNullable<T[P]> | undefined }

export function normalizePartial<T>(data: T) {
    for (const key in data) {
        if (data[key] === null) {
            delete data[key]
        }
    }

    return data as NormalizedPartial<T>
}

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