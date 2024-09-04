import { PrismaClient } from "@prisma/client"


const PrismaClientSingleton = () =>{
    return new PrismaClient();
}

declare global {
    var prismaGlobal : undefined | ReturnType <typeof PrismaClientSingleton>
}

const db = globalThis.prismaGlobal ?? PrismaClientSingleton();

export default db;

if(process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db ;