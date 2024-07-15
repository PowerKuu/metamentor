import type { User } from "@prisma/client"

const token = useCookie("token")

export const user = asyncComputed<User | null>(async () => {
    if (!token.value) {
        return null
    }

    const user = await serverFunction("getUser", token.value)

    if (isServerError(user)) {
        return null
    }

    return user
})
    
