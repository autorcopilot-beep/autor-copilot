import { ArrowUpRight, Layers3 } from 'lucide-react';
import Link from 'next/link';

import { createAdminClient } from '@/lib/supabase/admin';

export const metadata = { title: 'Publicações oficiais', description: 'Todos os catálogos públicos do Autor Copilot.' };

export default async function PublicationsHubPage() {
  const supabase = createAdminClient();
  const { data: catalogs } = await supabase.from('communication_catalogs').select('*').eq('is_public', true).order('display_order');
  return <main className="min-h-dvh bg-canvas text-ink"><section className="mx-auto max-w-6xl px-5 py-16 sm:py-24"><span className="flex size-12 items-center justify-center rounded-2xl bg-accent-subtle text-accent"><Layers3 className="size-5" /></span><p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-accent">Fonte oficial</p><h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold sm:text-6xl">Tudo que o Autor Copilot publica, organizado por contexto.</h1><p className="mt-6 max-w-2xl text-base leading-7 text-muted">Documentos legais, atualizações do produto, ajuda, comunicados, status, cartas e conteúdo editorial em endereços permanentes.</p><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{catalogs?.map((catalog) => <Link href={catalog.public_base_path} key={catalog.channel} className="group flex min-h-56 flex-col rounded-[1.5rem] border border-line bg-surface p-6 shadow-soft transition hover:-translate-y-1 hover:border-accent hover:shadow-floating"><span className="text-[10px] font-bold uppercase tracking-[.14em] text-accent">{catalog.channel}</span><h2 className="mt-7 font-serif text-2xl font-semibold">{catalog.name}</h2><p className="mt-3 text-sm leading-6 text-muted">{catalog.description}</p><span className="mt-auto flex items-center gap-2 pt-6 text-xs font-semibold text-accent">Explorar catálogo <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span></Link>)}</div></section></main>;
}

