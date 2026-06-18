import prisma from '@/lib/prisma';

interface AuditLogInput {
  userId?: string | null;
  action: string;
  entity?: string | null;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function createAuditLog(input: AuditLogInput) {
  try {
    await (prisma as any).auditLog.create({
      data: {
        userId: input.userId || null,
        action: input.action,
        entity: input.entity || null,
        entityId: input.entityId || null,
        metadata: input.metadata || undefined,
        ipAddress: input.ipAddress || null,
        userAgent: input.userAgent || null,
      },
    });
  } catch {
    // silently fail — audit logs should never break the app
  }
}

export function auditLogAction(action: string, entity?: string, entityId?: string) {
  return {
    action,
    entity,
    entityId,
  };
}
