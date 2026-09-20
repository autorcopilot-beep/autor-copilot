import 'server-only';

import { headers } from 'next/headers';

import type { AdminContext } from '@/features/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Json } from '@/types/database.generated';

type AuditEvent = {
  actor: AdminContext;
  action: string;
  targetType: string;
  targetId?: string;
  oldData?: Json;
  newData?: Json;
  metadata?: Record<string, Json | undefined>;
};

function firstForwardedValue(value: string | null) {
  return value?.split(',')[0]?.trim() || null;
}

export async function writeAdminAudit(event: AuditEvent) {
  const requestHeaders = await headers();
  const ipAddress = firstForwardedValue(requestHeaders.get('x-forwarded-for'))
    ?? requestHeaders.get('x-real-ip');
  const requestId = requestHeaders.get('x-request-id');
  const supabase = createAdminClient();

  const { error } = await supabase.from('admin_audit_logs').insert({
    actor_id: event.actor.userId,
    actor_role: event.actor.role,
    action: event.action,
    target_type: event.targetType,
    target_id: event.targetId ?? null,
    ip_address: ipAddress,
    user_agent: requestHeaders.get('user-agent'),
    old_data: event.oldData ?? null,
    new_data: event.newData ?? null,
    metadata: {
      ...event.metadata,
      ...(requestId ? { edge_request_id: requestId } : {}),
    },
  });

  if (error) throw new Error(`Falha ao registrar auditoria: ${error.message}`);
}
