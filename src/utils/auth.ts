import type { User } from "@prisma/client"

export function useAuth() {
    const token = useCookie("auth")
}

export function logout() {
    useCookie("auth").value = ""
}

export function login(token: string) {
    useCookie("auth").value = token
}