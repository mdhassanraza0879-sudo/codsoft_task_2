import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  console.error('CRITICAL: DATABASE_URL environment variable is missing!');
}

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma =
  globalForPrisma.prisma ||
  (function () {
    try {
      const client = createPrismaClient();
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = client;
      }
      return client;
    } catch (err: any) {
      console.error('Failed to initialize PrismaClient on startup:', err.message);
      return new Proxy({} as PrismaClient, {
        get(_target, prop) {
          if (prop === 'then') return undefined;
          const freshClient = createPrismaClient();
          return (freshClient as any)[prop];
        },
      });
    }
  })();

export default prisma;
