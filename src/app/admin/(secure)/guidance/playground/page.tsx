import Link from 'next/link';
import { ArrowLeft, FlaskConical } from 'lucide-react';

import { GuidancePlayground } from '@/features/admin/components/guidance-playground';
import { requireAdmin } from '@/features/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function GuidancePlaygroundPage() {
  await requireAdmin('guidance.read');
  const { data: targets, error } = await createAdminClient().from('product_guide_targets').select('target_key,route_pattern,selector,label,element_kind,description,source').order('route_pattern').order('label');
  return <div><Link href="/admin/guidance" className="inline-flex items-center gap-2 text-xs font-semibold text-accent"><ArrowLeft className="size-4" />Voltar aos guias</Link><div className="mt-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-accent">Laboratório seguro</p><h1 className="mt-2 font-serif text-3xl font-semibold">Playground de guias</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-muted">Reproduza superfícies do produto com dados de exemplo, selecione alvos reais do catálogo e copie seletores ou manifestos para automações MCP.</p></div><span className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-xs text-muted"><FlaskConical className="size-4 text-accent" />Sem bypass de permissões</span></div>{error ? <p className="mt-6 rounded-card bg-danger-subtle p-4 text-sm text-danger">{error.message}</p> : <div className="mt-7"><GuidancePlayground targets={targets ?? []} /></div>}</div>;
}
