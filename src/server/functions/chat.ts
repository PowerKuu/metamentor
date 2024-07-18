import type { Chat } from "@prisma/client"
import { prisma, verifyAuth } from "../server"

export async function editChat(auth: string, {
    id,
    name
}: Partial<Chat>, selectedModels?: string[]) {
    const maxName = 64

    const user = await verifyAuth(auth)

    if (!user) return 401

    if (name && name.length > maxName) return 413

    if (!id) {
        if (!name) return 400

        return prisma.chat.create({
            data: {
                name: name,

                users: {
                    create: {
                        userId: user.id,
                        permission: "OWNER"
                    }
                },

                models: {
                    connect: selectedModels?.map(model => ({
                        id: model
                    }))
                }
            }
        })
    }

    const existingModel = await prisma.chat.findFirst({
        where: {
            id,
            
            users: {
                some: {
                    userId: user.id,
                    permission: {
                        in: ["OWNER", "WRITE"]
                    }
                }
            }
        }
    })

    if (!existingModel) return 404

    return prisma.chat.update({
        where: {
            id
        },

        data: {
            name: name,

            models: {
                set: selectedModels?.map(model => ({
                    id: model
                }))
            }
        }
    })
}