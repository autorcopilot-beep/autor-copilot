import { ArrowRight, ExternalLink, Megaphone, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { requireAdmin } from '@/features/admin/auth';
import { OmniPublishBoard } from '@/features/admin/omnipublish/omnipublish-board';
import type { CampaignOverview } from '@/features/admin/omnipublish/types';
import { hasAdminPermission } from '@/features/admin/rbac';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function OmniPublishPage({ searchParams }: { searchParams: Promise<{ created?: string }> }) {
  const admin = await requireAdmin('communications.read');
  const params = await searchParams;
  const supabase = createAdminClient();
  const [{ data, error }, { data: catalogs }] = await Promise.all([
    supabase.from('communication_campaigns').select('*, communication_items(id, channel, title, slug, public_path, status, payload, published_at, last_error)').order('updated_at', { ascending: false }).limit(200),
    supabase.from('communication_catalogs').select('*').order('display_order'),
  ]);
  const campaigns = (data ?? []) as CampaignOverview[];
  const canManage = hasAdminPermission(admin.role, 'communications.manage');

  return <div>
    {params.created === '1' && <div className="mb-6 flex items-center gap-2 rounded-xl border border-success/25 bg-success-subtle px-4 py-3 text-sm text-success" role="status"><Sparkles className="size-4" />Campanha guardada. Ela já está disponível para revisão.</div>}
    <section className="relative overflow-hidden rounded-[1.75rem] border border-line bg-surface p-6 shadow-soft sm:p-9"><div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-accent-subtle blur-3xl" aria-hidden="true" /><div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between"><div><span className="flex size-11 items-center justify-center rounded-xl bg-accent text-on-accent shadow-soft"><Megaphone className="size-5" /></span><p className="mt-6 text-xs font-bold uppercase tracking-[.2em] text-accent">OmniPublish</p><h1 className="mt-2 max-w-3xl font-serif text-3xl font-semibold sm:text-4xl">Uma mensagem, cada canal em sua melhor forma.</h1><p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">Planeje campanhas, adapte a narrativa para e-mail, produto, ajuda, status e editorial, e acompanhe cada entrega em uma trilha auditável.</p></div>{canManage && <Link href="/admin/publish/new" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-on-accent shadow-soft hover:bg-accent-hover">Nova campanha master<ArrowRight className="size-4" /></Link>}</div></section>
    <section className="mt-6"><div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-accent">Catálogos conectados</p><h2 className="mt-1 font-serif text-xl font-semibold">Sete canais, uma fonte editorial</h2></div><Link href="/admin/apis" className="text-xs font-semibold text-accent">Ver APIs</Link></div><div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">{catalogs?.map((catalog) => <article key={catalog.channel} className="flex min-h-32 flex-col rounded-2xl border border-line bg-surface p-4 shadow-soft"><strong className="text-xs">{catalog.name}</strong><code className="mt-2 truncate text-[9px] text-muted">{catalog.public_base_path}</code><div className="mt-auto flex items-center justify-between pt-4"><Link href={`/admin/publish/new?channel=${catalog.channel}`} className="text-[10px] font-semibold text-accent">Criar</Link><Link href={catalog.public_base_path} target="_blank" aria-label={`Abrir ${catalog.name}`} className="text-muted hover:text-ink"><ExternalLink className="size-3.5" /></Link></div></article>)}</div></section>
    {error ? <div className="mt-6 rounded-xl border border-danger/25 bg-danger-subtle p-4 text-sm text-danger">Não foi possível carregar o OmniPublish: {error.message}</div> : <div className="mt-6"><OmniPublishBoard campaigns={campaigns} canManage={canManage} /></div>}
  </div>;
}

