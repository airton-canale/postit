import { PrismaClient } from "@prisma/client";

declare global {
  namespace NodeJS {
    interface Global {}
  }
}

//add prisma to the nodeJS global type
interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient;
}

//Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

const client = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = client;

export default client;
