import type { User } from "@prisma/client"

export function useAuth() {
    const token = useCookie("auth")

    const user = asyncComputed<User | null>(async () => {
        if (!token.value) return null

        const data = await serverFunction("getUser", token.value)

        if (isServerError(data)) {
            return null
        }

        return data
    }, undefined)

    return user
}

export function logout() {
    useCookie("auth").value = ""
}

export function login(token: string) {
    useCookie("auth").value = token
}