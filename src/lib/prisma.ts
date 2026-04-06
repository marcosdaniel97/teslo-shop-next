// es el archivo que te permite hablar con tu base de datos desde toda tu aplicación
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter } as any);
}

export const prisma = globalForPrisma.prisma || createPrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Vieja importacion de Prisma

/* import { PrismaClient } from '../generated/prisma/client';

const prismaClientSingleton =()=>{
    return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma?? prismaClientSingleton()

export default prisma

if(process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
 */
