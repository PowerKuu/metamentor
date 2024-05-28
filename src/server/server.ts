import { PrismaClient } from "@prisma/client"
import * as status_ from "./functions/status"

export const prisma = new PrismaClient()

export const functions = { ...status_ }

export type Functions = typeof functions
export type FunctionNames = keyof Functions