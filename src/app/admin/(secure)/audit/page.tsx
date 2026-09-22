import { requireAdmin } from '@/features/admin/auth';
import { AuditEventsTable, type AuditEventRow } from '@/features/admin/components/audit-events-table';
import { createClient } from '@/lib/supabase/server';

export default async function AuditPage() {
  await requireAdmin('audit.read');
  const supabase = await createClient();
  const { data: events } = await supabase.from('admin_audit_logs').select('event_id, actor_role, action, target_type, target_id, ip_address, occurred_at').order('occurred_at', { ascending: false }).limit(500);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Audit Trails V1</p>
      <h1 className="mt-2 text-3xl font-semibold">Trilha de auditoria</h1>
      <p className="mt-3 text-sm text-white/50">Os eventos são imutáveis e exibidos do mais recente para o mais antigo.</p>
      <div className="mt-7"><AuditEventsTable events={(events ?? []) as AuditEventRow[]} /></div>
    </div>
  );
}
