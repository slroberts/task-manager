import { PrismaClient } from '@prisma/client';

// Extend the NodeJS.Global interface to include the prisma property
declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient | undefined;
    }
  }
}

// Add a new property `globalThis.prisma` if it doesn't already exist
const globalForPrisma = global as typeof global & { prisma?: PrismaClient };

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'development') {
  prisma = new PrismaClient();
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  prisma = globalForPrisma.prisma;
}

export default prisma;
