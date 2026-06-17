import prisma from './lib/prisma';

export async function register() {
  try {
    await prisma.$connect();
    console.log('[DB] PostgreSQL connected successfully');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[DB] PostgreSQL connection failed:', message);
  }
}
