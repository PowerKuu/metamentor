import { PrismaClient } from "@prisma/client"
import * as status_ from "./functions/status"
import * as chat_ from "./functions/chat"
import * as model_ from "./functions/model"


export const prisma = new PrismaClient()


export const functions = { ...status_, ...chat_, ...model_ }

export type Functions = typeof functions
export type FunctionNames = keyof Functions