import { z } from 'zod';
import { createApiError } from '@/lib/api-handler';

export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw createApiError('Validation failed', 400, result.error.flatten().fieldErrors);
  }
  return result.data;
}

export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

const INVALID_TAG = /<script[\s\S]*?<\/script>|<iframe[\s\S]*?<\/iframe>|<embed[\s\S]*?>|<object[\s\S]*?<\/object>/gi;
const EVENT_HANDLER = /\s+on\w+\s*=\s*["'][^"']*["']/gi;
const DANGEROUS_PROTOCOLS = /\s*(href|src|action)\s*=\s*["']\s*javascript\s*:/gi;

export function sanitizeRichText(input: string): string {
  return input
    .replace(INVALID_TAG, '')
    .replace(EVENT_HANDLER, '')
    .replace(DANGEROUS_PROTOCOLS, '')
    .trim();
}
