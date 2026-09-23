import Link from 'next/link';
import { EmbeddedPublication } from '@/features/public-site/embedded-publication';
import Image from 'next/image';
import { ArrowRight, CalendarDays, ChevronLeft, Sparkles } from 'lucide-react';
import { notFound } from 'next/navigation';

import { buildOmniPublishSandboxDocument } from '@/features/admin/omnipublish/render-code-page';
import { channelDefinitions, payloadAsRecord, type CommunicationChannel } from '@/features/admin/omnipublish/types';
import { loadPublicCatalog, loadPublicPublication } from '@/features/omnipublish/publications';

export async function PublicCatalogPage({ channel }: { channel: CommunicationChannel }) {
  const { catalog, items } = await loadPublicCatalog(channel);
  const definition = channelDefinitions[channel];
  return <main className="min-h-dvh bg-canvas text-ink"><section className="mx-auto max-w-6xl px-5 py-14 sm:py-20"><p className="text-xs font-bold uppercase tracking-[.2em] text-accent">{catalog?.settings && typeof catalog.settings === 'object' && !Array.isArray(catalog.settings) ? String(catalog.settings.eyebrow ?? 'Publicações oficiais') : 'Publicações oficiais'}</p><h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold sm:text-6xl">{catalog?.name ?? definition.label}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-muted">{catalog?.description ?? definition.description}</p><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => { const fields = payloadAsRecord(item.payload); const summary = String(fields.excerpt || fields.tldr || fields.preheader || fields.message || item.communication_campaigns.summary || 'Leia a publicação completa.'); return <Link key={item.id} href={item.public_path ?? '#'} className="group flex min-h-64 flex-col rounded-[1.5rem] border border-line bg-surface p-6 shadow-soft transition hover:-translate-y-1 hover:border-accent hover:shadow-floating"><div className="flex items-center justify-between"><Sparkles className="size-4 text-accent" /><span className="text-[10px] uppercase tracking-[.13em] text-muted">{formatDate(item.published_at)}</span></div><h2 className="mt-8 font-serif text-2xl font-semibold">{item.title}</h2><p className="mt-3 line-clamp-4 text-sm leading-6 text-muted">{summary}</p><span className="mt-auto flex items-center gap-2 pt-6 text-xs font-semibold text-accent">Abrir publicação <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" /></span></Link>; })}</div>{!items.length && <div className="mt-12 rounded-[1.5rem] border border-dashed border-line-strong bg-surface p-12 text-center"><Sparkles className="mx-auto size-7 text-accent" /><h2 className="mt-4 font-serif text-2xl font-semibold">Catálogo em preparação</h2><p className="mt-2 text-sm text-muted">As primeiras publicações aparecerão aqui assim que forem aprovadas.</p></div>}</section></main>;
}

export async function PublicPublicationPage({ channel, slug }: { channel: CommunicationChannel; slug: string }) {
  const item = await loadPublicPublication(channel, slug);
  if (!item) notFound();
  const fields = payloadAsRecord(item.payload);
  const customHtml = String(fields.custom_html || '');
  if (customHtml) {
    const srcDoc = buildOmniPublishSandboxDocument({ html: customHtml, css: String(fields.custom_css || ''), js: String(fields.custom_js || '') });
    return <main className="flex min-h-dvh flex-col bg-canvas"><header className="flex min-h-14 items-center justify-between border-b border-line bg-surface px-4 sm:px-6"><Link href={item.public_path?.split('/').slice(0, -1).join('/') || '/'} className="inline-flex items-center gap-2 text-xs font-semibold text-ink"><ChevronLeft className="size-3.5" />Voltar ao catálogo</Link><span className="text-[10px] font-bold uppercase tracking-[.16em] text-accent">Autor Copilot</span></header><EmbeddedPublication title={item.title} srcDoc={srcDoc} /></main>;
  }
  const body = String(fields.body || fields.message || fields.tldr || item.communication_campaigns.summary || '');
  const cover = String(fields.cover_url || fields.og_image || '');
  return <main className="min-h-dvh bg-canvas text-ink"><header className="border-b border-line bg-surface"><div className="mx-auto flex min-h-16 max-w-4xl items-center justify-between px-5"><Link href={item.public_path?.split('/').slice(0, -1).join('/') || '/'} className="inline-flex items-center gap-2 text-xs font-semibold"><ChevronLeft className="size-3.5" />Catálogo</Link><span className="text-[10px] font-bold uppercase tracking-[.16em] text-accent">{channelDefinitions[channel].shortLabel}</span></div></header><article className="mx-auto max-w-4xl px-5 py-14 sm:py-20"><p className="flex items-center gap-2 text-xs text-muted"><CalendarDays className="size-3.5" />{formatDate(item.published_at)}</p><h1 className="mt-5 max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-6xl">{item.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{String(fields.subtitle || fields.excerpt || item.communication_campaigns.summary || '')}</p>{cover && <Image src={cover} alt={String(fields.cover_alt || '')} width={1600} height={800} unoptimized className="mt-10 aspect-[16/8] w-full rounded-[1.75rem] object-cover shadow-floating" />}<div className="mt-12 whitespace-pre-wrap font-serif text-[1.05rem] leading-8 text-ink">{body}</div>{detailSections(fields).length > 0 && <div className="mt-12 grid gap-4 sm:grid-cols-2">{detailSections(fields).map((section) => <section key={section.label} className="rounded-2xl border border-line bg-surface p-5"><h2 className="font-serif text-xl font-semibold">{section.label}</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted">{section.value}</p></section>)}</div>}{item.communication_campaigns.campaign_tags.length > 0 && <div className="mt-12 flex flex-wrap gap-2 border-t border-line pt-6">{item.communication_campaigns.campaign_tags.map((tag) => <span key={tag} className="rounded-full bg-accent-subtle px-3 py-1 text-xs text-accent">#{tag}</span>)}</div>}</article></main>;
}

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(value)) : 'Recente';
}


function detailSections(fields: Record<string, string | boolean>) {
  const definitions = [['highlights', 'Destaques'], ['improvements', 'Melhorias'], ['fixes', 'Correções'], ['breaking_changes', 'Mudanças incompatíveis'], ['migration_notes', 'Orientações de migração'], ['known_issues', 'Limitações conhecidas']] as const;
  return definitions.map(([key, label]) => ({ label, value: String(fields[key] || '') })).filter((section) => section.value.trim());
}


