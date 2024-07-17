import type { Model } from "@prisma/client"
import { prisma, verifyAuth } from "../server"

export async function editModel(auth: string, {
    name,
    description,
    system,
    avatar
}: Partial<Model>, editModel?: string) {
    const maxName = 64
    const maxDescription = 256
    const maxAvatar = 1000
    const maxSystem = 1000

    const user = await verifyAuth(auth)

    if (!user) return 401

    if (name && name.length > maxName) return 413
    if (description && description.length > maxDescription) return 413
    if (avatar && avatar.length > maxAvatar) return 413
    if (system && system.length > maxSystem) return 413


    if (!editModel) {
        if (!name || !description || !system || !avatar) return 400


        return prisma.model.create({
            data: {
                name: name,
                description: description,
                system: system,
                avatar: avatar,
                
                owner: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })
    }

    const existingModel = await prisma.model.findFirst({
        where: {
            id: editModel,
            ownerId: user.id
        }
    })

    if (!existingModel) return 404

    return prisma.model.update({
        where: {
            id: editModel
        },

        data: {
            name: name,
            description: description,
            system: system,
            avatar: avatar
        }
    })
}