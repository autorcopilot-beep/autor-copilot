'use client';

import {
  AlertTriangle, ArrowLeft, ArrowRight, BookOpenText, CalendarClock, Check,
  FileText, Globe2, Mail, Megaphone, Radio, Rocket, Save,
  Send, Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';

import { createCommunicationCampaign } from '@/features/admin/actions/omnipublish';
import {
  channelDefinitions, communicationChannels, type CampaignDraftInput,
  type ChannelDraft, type CommunicationChannel, type CommunicationComponent, type CommunicationMediaAsset,
} from '@/features/admin/omnipublish/types';
import { CreativeComposer } from '@/features/admin/omnipublish/creative-composer';
import { cn } from '@/lib/cn';

const channelIcons = { email: Mail, legal: FileText, changelog: Rocket, knowledge: BookOpenText, in_app: Megaphone, status: Radio, blog: Globe2 };
const steps = ['Briefing', 'Canais', 'Composição', 'Revisão'] as const;

function initialItems(title = ''): Record<CommunicationChannel, ChannelDraft> {
  return Object.fromEntries(communicationChannels.map((channel) => [channel, {
    title,
    fields: Object.fromEntries(channelDefinitions[channel].fields.map((field) => [field.key, field.kind === 'checkbox' ? false : field.options?.[0] ?? ''])),
  }])) as Record<CommunicationChannel, ChannelDraft>;
}

function slugify(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 120);
}

export function OmniPublishStudio({ initialComponents, initialAssets, initialChannel }: { initialComponents: CommunicationComponent[]; initialAssets: CommunicationMediaAsset[]; initialChannel?: CommunicationChannel }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [internalName, setInternalName] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [audience, setAudience] = useState<CampaignDraftInput['audience']>({ accountStatus: 'active', plan: 'all', locale: 'pt-BR', operator: 'and' });
  const [selectedChannels, setSelectedChannels] = useState<CommunicationChannel[]>(initialChannel ? [initialChannel] : ['email', 'changelog', 'in_app']);
  const [activeChannel, setActiveChannel] = useState<CommunicationChannel>(initialChannel ?? 'email');
  const [items, setItems] = useState<Record<CommunicationChannel, ChannelDraft>>(() => initialItems());

  const completion = useMemo(() => {
    const total = 3 + selectedChannels.length;
    const done = Number(Boolean(internalName.trim())) + Number(Boolean(title.trim())) + Number(selectedChannels.length > 0)
      + selectedChannels.filter((channel) => items[channel].title.trim()).length;
    return Math.round((done / Math.max(total, 1)) * 100);
  }, [internalName, items, selectedChannels, title]);

  function updateMasterTitle(value: string) {
    setTitle(value);
    setItems((current) => Object.fromEntries(communicationChannels.map((channel) => {
      const item = current[channel];
      const previousWasGenerated = !item.title || item.title === title;
      const fields = { ...item.fields };
      if (channel === 'email' && (!fields.subject || fields.subject === title)) fields.subject = value;
      if (channel === 'in_app' && (!fields.visible_title || fields.visible_title === title)) fields.visible_title = value.slice(0, 50);
      if (channel === 'blog' && (!fields.slug || fields.slug === slugify(title))) fields.slug = slugify(value);
      return [channel, { ...item, title: previousWasGenerated ? value : item.title, fields }];
    })) as Record<CommunicationChannel, ChannelDraft>);
  }

  function toggleChannel(channel: CommunicationChannel) {
    setSelectedChannels((current) => current.includes(channel) ? current.filter((item) => item !== channel) : [...current, channel]);
    setActiveChannel(channel);
  }

  function updateField(channel: CommunicationChannel, key: string, value: string | boolean) {
    setItems((current) => ({ ...current, [channel]: { ...current[channel], fields: { ...current[channel].fields, [key]: value } } }));
  }

  function goNext() {
    setError('');
    if (step === 0 && (!internalName.trim() || !title.trim())) { setError('Preencha o nome interno e o título principal.'); return; }
    if (step === 1 && !selectedChannels.length) { setError('Selecione ao menos um canal de publicação.'); return; }
    setStep((current) => Math.min(3, current + 1));
  }

  function saveCampaign() {
    setError('');
    const input: CampaignDraftInput = {
      internalName, title, summary, channels: selectedChannels,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      audience, scheduledFor: scheduledFor || null, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo', items,
    };
    startTransition(async () => {
      try {
        await createCommunicationCampaign(input);
        router.push('/admin/publish?created=1');
        router.refresh();
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : 'Não foi possível guardar a campanha.');
      }
    });
  }

  return <div className="mx-auto max-w-[92rem]">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><Link href="/admin/publish" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink"><ArrowLeft className="size-3.5" />Voltar ao OmniPublish</Link><p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-accent">Estúdio multicanal</p><h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">Nova campanha master</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">Um briefing, mensagens próprias para cada contexto e uma única operação rastreável.</p></div>
      <div className="rounded-2xl border border-line bg-surface p-4 shadow-soft"><div className="flex items-center justify-between gap-8 text-xs"><span className="text-muted">Preparação</span><strong className="text-ink">{completion}%</strong></div><div className="mt-2 h-1.5 w-44 overflow-hidden rounded-full bg-surface-muted"><span className="block h-full rounded-full bg-accent transition-[width]" style={{ width: `${completion}%` }} /></div></div>
    </div>

    <ol className="mt-8 grid grid-cols-4 overflow-hidden rounded-2xl border border-line bg-surface shadow-soft" aria-label="Etapas da campanha">
      {steps.map((label, index) => <li key={label}><button type="button" onClick={() => index <= step && setStep(index)} className={cn('flex min-h-16 w-full items-center justify-center gap-2 border-r border-line px-2 text-xs font-medium last:border-r-0 sm:justify-start sm:px-4', index === step ? 'bg-accent-subtle text-accent' : index < step ? 'text-ink' : 'text-muted')} aria-current={index === step ? 'step' : undefined}><span className={cn('flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px]', index <= step ? 'border-accent bg-accent text-on-accent' : 'border-line')}>{index < step ? <Check className="size-3" /> : index + 1}</span><span className="hidden sm:inline">{label}</span></button></li>)}
    </ol>

    {error && <div className="mt-5 flex items-start gap-2 rounded-xl border border-danger/25 bg-danger-subtle px-4 py-3 text-sm text-danger" role="alert"><AlertTriangle className="mt-0.5 size-4 shrink-0" />{error}</div>}

    <div className="mt-6 min-h-[34rem] rounded-[1.75rem] border border-line bg-surface shadow-soft">
      {step === 0 && <BriefingStep internalName={internalName} setInternalName={setInternalName} title={title} updateMasterTitle={updateMasterTitle} summary={summary} setSummary={setSummary} tags={tags} setTags={setTags} audience={audience} setAudience={setAudience} scheduledFor={scheduledFor} setScheduledFor={setScheduledFor} />}
      {step === 1 && <ChannelStep selected={selectedChannels} toggle={toggleChannel} />}
      {step === 2 && <CompositionStep selected={selectedChannels} active={activeChannel} setActive={setActiveChannel} items={items} setItems={setItems} updateField={updateField} initialComponents={initialComponents} initialAssets={initialAssets} />}
      {step === 3 && <ReviewStep title={title} summary={summary} selected={selectedChannels} items={items} scheduledFor={scheduledFor} audience={audience} />}
    </div>

    <div className="sticky bottom-4 z-20 mx-auto mt-5 flex max-w-2xl items-center justify-between rounded-2xl border border-line bg-surface/95 p-3 shadow-floating backdrop-blur-xl">
      <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0 || pending} className="inline-flex min-h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium text-muted hover:bg-surface-muted hover:text-ink disabled:opacity-35"><ArrowLeft className="size-4" />Voltar</button>
      <span className="hidden text-xs text-muted sm:block">Etapa {step + 1} de {steps.length}</span>
      {step < 3 ? <button type="button" onClick={goNext} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-on-accent hover:bg-accent-hover">Continuar<ArrowRight className="size-4" /></button> : <button type="button" onClick={saveCampaign} disabled={pending} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-on-accent hover:bg-accent-hover disabled:opacity-60">{pending ? <><Sparkles className="size-4 animate-pulse" />Guardando…</> : <><Save className="size-4" />Guardar campanha</>}</button>}
    </div>
  </div>;
}

function BriefingStep({ internalName, setInternalName, title, updateMasterTitle, summary, setSummary, tags, setTags, audience, setAudience, scheduledFor, setScheduledFor }: {
  internalName: string; setInternalName: (value: string) => void; title: string; updateMasterTitle: (value: string) => void; summary: string; setSummary: (value: string) => void; tags: string; setTags: (value: string) => void; audience: CampaignDraftInput['audience']; setAudience: (value: CampaignDraftInput['audience']) => void; scheduledFor: string; setScheduledFor: (value: string) => void;
}) {
  const field = 'mt-2 min-h-11 w-full rounded-xl border border-line bg-editor px-3.5 text-sm text-ink outline-none placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/15';
  return <div className="grid min-h-[34rem] lg:grid-cols-[1.25fr_.75fr]">
    <section className="p-6 sm:p-9"><span className="flex size-11 items-center justify-center rounded-xl bg-accent-subtle text-accent"><Sparkles className="size-5" /></span><h2 className="mt-5 font-serif text-2xl font-semibold">O que precisa ser comunicado?</h2><p className="mt-2 text-sm text-muted">O título principal alimenta os canais automaticamente, sem impedir ajustes individuais.</p><div className="mt-7 grid gap-5 sm:grid-cols-2"><label className="text-xs font-medium text-muted">Nome interno<input value={internalName} onChange={(event) => setInternalName(event.target.value)} className={field} placeholder="Lançamento · Editor 2.0" maxLength={160} /></label><label className="text-xs font-medium text-muted">Título principal<input value={title} onChange={(event) => updateMasterTitle(event.target.value)} className={field} placeholder="Uma nova forma de construir histórias" maxLength={180} /></label><label className="text-xs font-medium text-muted sm:col-span-2">Resumo estratégico<textarea value={summary} onChange={(event) => setSummary(event.target.value)} className={`${field} min-h-28 py-3 leading-relaxed`} placeholder="Contexto, objetivo e a principal mudança para o público." /></label><label className="text-xs font-medium text-muted sm:col-span-2">Tags internas<input value={tags} onChange={(event) => setTags(event.target.value)} className={field} placeholder="editor, lançamento, setembro" /></label></div></section>
    <aside className="border-t border-line bg-surface-muted/45 p-6 sm:p-9 lg:border-l lg:border-t-0"><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">Distribuição</p><h3 className="mt-2 font-serif text-xl font-semibold">Audiência e cadência</h3><div className="mt-6 space-y-5"><label className="block text-xs font-medium text-muted">Status da conta<select value={audience.accountStatus} onChange={(event) => setAudience({ ...audience, accountStatus: event.target.value })} className={field}><option value="active">Ativa</option><option value="all">Todas</option><option value="beta">Beta</option></select></label><label className="block text-xs font-medium text-muted">Plano<select value={audience.plan} onChange={(event) => setAudience({ ...audience, plan: event.target.value })} className={field}><option value="all">Todos os planos</option><option value="free">Free</option><option value="pro">Pro</option><option value="beta">Beta</option></select></label><label className="block text-xs font-medium text-muted">Idioma<select value={audience.locale} onChange={(event) => setAudience({ ...audience, locale: event.target.value })} className={field}><option value="pt-BR">Português (Brasil)</option><option value="en">English</option><option value="es">Español</option></select></label><label className="block text-xs font-medium text-muted">Publicar em<input type="datetime-local" value={scheduledFor} onChange={(event) => setScheduledFor(event.target.value)} className={field} /></label></div><div className="mt-6 flex items-start gap-3 rounded-xl border border-line bg-surface p-4"><CalendarClock className="mt-0.5 size-4 shrink-0 text-accent" /><p className="text-xs leading-relaxed text-muted">Sem uma data, a campanha fica pronta para orquestração manual após a revisão.</p></div></aside>
  </div>;
}

function ChannelStep({ selected, toggle }: { selected: CommunicationChannel[]; toggle: (channel: CommunicationChannel) => void }) {
  return <section className="p-6 sm:p-9"><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">Arquitetura da campanha</p><h2 className="mt-2 font-serif text-2xl font-semibold">Escolha os pontos de contato</h2><p className="mt-2 max-w-2xl text-sm text-muted">Cada canal recebe um editor próprio, limites adequados e uma prévia fiel ao contexto.</p><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{communicationChannels.map((channel) => { const definition = channelDefinitions[channel]; const Icon = channelIcons[channel]; const active = selected.includes(channel); return <button key={channel} type="button" onClick={() => toggle(channel)} aria-pressed={active} className={cn('group relative min-h-44 overflow-hidden rounded-2xl border p-5 text-left transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:shadow-floating', active ? 'border-accent bg-accent-subtle' : 'border-line bg-editor')}><span className="flex size-10 items-center justify-center rounded-xl bg-surface text-accent shadow-soft"><Icon className="size-5" /></span><span className="mt-5 block font-serif text-lg font-semibold text-ink">{definition.label}</span><span className="mt-1 block text-xs leading-relaxed text-muted">{definition.description}</span><span className={cn('absolute right-4 top-4 flex size-6 items-center justify-center rounded-full border', active ? 'border-accent bg-accent text-on-accent' : 'border-line bg-surface')}>{active && <Check className="size-3.5" />}</span></button>; })}</div></section>;
}

function CompositionStep({ selected, active, setActive, items, setItems, updateField, initialComponents, initialAssets }: { selected: CommunicationChannel[]; active: CommunicationChannel; setActive: (channel: CommunicationChannel) => void; items: Record<CommunicationChannel, ChannelDraft>; setItems: React.Dispatch<React.SetStateAction<Record<CommunicationChannel, ChannelDraft>>>; updateField: (channel: CommunicationChannel, key: string, value: string | boolean) => void; initialComponents: CommunicationComponent[]; initialAssets: CommunicationMediaAsset[] }) {
  const current = selected.includes(active) ? active : selected[0];
  const definition = channelDefinitions[current];
  const item = items[current];
  const fieldClass = 'mt-2 min-h-10 w-full rounded-xl border border-line bg-editor px-3 text-sm text-ink outline-none placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/15';
  return <div className="grid min-h-[42rem] xl:grid-cols-[13rem_minmax(0,1fr)]">
    <nav className="border-b border-line p-3 xl:border-b-0 xl:border-r" aria-label="Canais selecionados"><p className="px-3 py-3 text-[10px] font-bold uppercase tracking-[.16em] text-muted">Peças da campanha</p><div className="flex gap-1 overflow-x-auto xl:block">{selected.map((channel) => { const Icon = channelIcons[channel]; return <button key={channel} type="button" onClick={() => setActive(channel)} className={cn('flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-xs font-medium xl:mb-1 xl:w-full', current === channel ? 'bg-accent-subtle text-accent' : 'text-muted hover:bg-surface-muted hover:text-ink')}><Icon className="size-4" />{channelDefinitions[channel].shortLabel}</button>; })}</div></nav>
    <section className="p-5 sm:p-7"><div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-accent">{(() => { const Icon = channelIcons[current]; return <Icon className="size-5" />; })()}</span><div><h2 className="font-serif text-2xl font-semibold">{definition.label}</h2><p className="mt-1 text-xs text-muted">{definition.description}</p></div></div><div className="mt-7 grid gap-5 sm:grid-cols-2"><label className="text-xs font-medium text-muted sm:col-span-2">Título desta peça<input value={item.title} onChange={(event) => setItems((state) => ({ ...state, [current]: { ...state[current], title: event.target.value } }))} className={fieldClass} maxLength={200} /></label>{definition.fields.map((field) => <label key={field.key} className={cn('text-xs font-medium text-muted', field.wide && 'sm:col-span-2')}>{field.kind === 'checkbox' ? <span className="flex min-h-11 items-center gap-3 rounded-xl border border-line bg-editor px-3"><input type="checkbox" checked={Boolean(item.fields[field.key])} onChange={(event) => updateField(current, field.key, event.target.checked)} className="size-4 accent-[var(--color-accent)]" /><span>{field.label}</span></span> : <>{field.label}{field.kind === 'textarea' ? <textarea value={String(item.fields[field.key] ?? '')} onChange={(event) => updateField(current, field.key, event.target.value)} placeholder={field.placeholder} maxLength={field.maxLength} className={`${fieldClass} min-h-28 py-3 leading-relaxed`} /> : field.kind === 'select' ? <select value={String(item.fields[field.key] ?? '')} onChange={(event) => updateField(current, field.key, event.target.value)} className={fieldClass}>{field.options?.map((option) => <option key={option}>{option}</option>)}</select> : <input type={field.kind === 'date' ? 'date' : field.kind === 'datetime' ? 'datetime-local' : field.kind === 'url' ? 'url' : 'text'} value={String(item.fields[field.key] ?? '')} onChange={(event) => updateField(current, field.key, event.target.value)} placeholder={field.placeholder} maxLength={field.maxLength} className={fieldClass} />}{field.maxLength && <span className="mt-1 block text-right text-[10px] text-muted">{String(item.fields[field.key] ?? '').length}/{field.maxLength}</span>}</>}</label>)}</div><details className="mt-8 rounded-2xl border border-line bg-surface-muted/35 p-4"><summary className="cursor-pointer text-xs font-semibold text-ink">Prévia estruturada do canal</summary><div className="mx-auto max-w-3xl"><ChannelPreview channel={current} item={item} /></div></details><CreativeComposer value={{ html: String(item.fields.custom_html ?? ''), css: String(item.fields.custom_css ?? ''), js: String(item.fields.custom_js ?? '') }} onChange={(code) => setItems((state) => ({ ...state, [current]: { ...state[current], fields: { ...state[current].fields, custom_html: code.html, custom_css: code.css, custom_js: code.js } } }))} initialComponents={initialComponents} initialAssets={initialAssets} /></section>
  </div>;
}

function ChannelPreview({ channel, item }: { channel: CommunicationChannel; item: ChannelDraft }) {
  const fields = item.fields; const body = String(fields.body || fields.message || fields.tldr || 'A mensagem aparecerá aqui conforme você escreve.');
  if (channel === 'in_app') return <div className="relative mt-6 h-[30rem] overflow-hidden rounded-2xl border border-line bg-canvas"><div className="h-12 border-b border-line bg-surface" /><div className="m-5 h-3 w-2/3 rounded-full bg-line" /><div className="m-5 h-3 w-1/2 rounded-full bg-line" /><div className="absolute inset-x-4 bottom-4 rounded-2xl border border-line bg-surface p-4 shadow-floating"><p className="font-serif text-lg font-semibold">{String(fields.visible_title || item.title)}</p><p className="mt-1 text-xs leading-relaxed text-muted">{body}</p>{fields.cta_label && <span className="mt-3 inline-flex rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-on-accent">{String(fields.cta_label)}</span>}</div></div>;
  if (channel === 'email') return <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-editor shadow-soft"><div className="space-y-2 border-b border-line bg-surface px-4 py-3 text-[11px] text-muted"><p><strong className="text-ink">De:</strong> {String(fields.sender)}</p><p><strong className="text-ink">Assunto:</strong> {String(fields.subject || item.title)}</p><p>{String(fields.preheader || 'Pré-header da campanha')}</p></div><div className="p-6 text-center"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-accent">Autor Copilot</span><h4 className="mt-4 font-serif text-2xl font-semibold">{item.title}</h4><p className="mt-4 whitespace-pre-wrap text-left text-sm leading-relaxed text-muted">{body}</p><span className="mt-6 inline-flex rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-on-accent">Conhecer a novidade</span></div></div>;
  if (channel === 'status') return <div className="mt-6 rounded-2xl border border-line bg-surface p-5 shadow-soft"><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-warning" /><span className="text-xs font-semibold text-warning">{String(fields.severity || 'Investigando')}</span></div><h4 className="mt-4 font-serif text-xl font-semibold">{item.title}</h4><p className="mt-1 text-xs text-muted">{String(fields.impact)} · {String(fields.affected_services)}</p><div className="mt-5 border-l-2 border-line pl-4"><time className="text-[10px] text-muted">Agora</time><p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{body}</p></div></div>;
  return <article className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">{(channel === 'blog' || channel === 'changelog') && <div className="flex h-32 items-center justify-center bg-gradient-to-br from-accent-subtle to-surface-muted text-accent"><Sparkles className="size-7" /></div>}<div className="p-6"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-accent">{channelDefinitions[channel].label}</p><h4 className="mt-3 font-serif text-2xl font-semibold">{item.title || 'Título da publicação'}</h4>{fields.subtitle && <p className="mt-2 text-sm text-muted">{String(fields.subtitle)}</p>}<p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-muted">{body}</p></div></article>;
}

function ReviewStep({ title, summary, selected, items, scheduledFor, audience }: { title: string; summary: string; selected: CommunicationChannel[]; items: Record<CommunicationChannel, ChannelDraft>; scheduledFor: string; audience: CampaignDraftInput['audience'] }) {
  return <div className="grid min-h-[34rem] lg:grid-cols-[1fr_.42fr]"><section className="p-6 sm:p-9"><div className="flex size-11 items-center justify-center rounded-xl bg-success-subtle text-success"><Check className="size-5" /></div><h2 className="mt-5 font-serif text-2xl font-semibold">Campanha pronta para ser guardada</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">O rascunho entra no fluxo de revisão. A publicação só é enfileirada depois de uma ação explícita no painel.</p><div className="mt-7 rounded-2xl border border-line bg-editor p-5"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-accent">Mensagem central</p><h3 className="mt-2 font-serif text-2xl font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{summary || 'Sem resumo estratégico.'}</p></div><div className="mt-5 space-y-3">{selected.map((channel) => { const Icon = channelIcons[channel]; return <div key={channel} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4"><span className="flex size-9 items-center justify-center rounded-lg bg-accent-subtle text-accent"><Icon className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-sm font-medium">{channelDefinitions[channel].label}</p><p className="truncate text-xs text-muted">{items[channel].title}</p></div><span className="rounded-full bg-success-subtle px-2.5 py-1 text-[10px] font-semibold text-success">Incluído</span></div>; })}</div></section><aside className="border-t border-line bg-surface-muted/45 p-6 sm:p-9 lg:border-l lg:border-t-0"><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">Resumo operacional</p><dl className="mt-6 space-y-5 text-sm"><div><dt className="text-xs text-muted">Canais</dt><dd className="mt-1 font-medium">{selected.length} peças coordenadas</dd></div><div><dt className="text-xs text-muted">Audiência</dt><dd className="mt-1 font-medium">{audience.plan === 'all' ? 'Todos os planos' : audience.plan} · {audience.locale}</dd></div><div><dt className="text-xs text-muted">Cadência</dt><dd className="mt-1 font-medium">{scheduledFor ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(scheduledFor)) : 'Publicação manual'}</dd></div><div><dt className="text-xs text-muted">Estado inicial</dt><dd className="mt-1 inline-flex rounded-full bg-warning-subtle px-2.5 py-1 text-xs font-semibold text-warning">Rascunho</dd></div></dl><div className="mt-8 rounded-xl border border-accent/20 bg-accent-subtle p-4"><Send className="size-4 text-accent" /><p className="mt-3 text-xs leading-relaxed text-muted">A orquestração criará uma entrega independente para cada canal, permitindo retentativas e auditoria sem duplicar a campanha.</p></div></aside></div>;
}
