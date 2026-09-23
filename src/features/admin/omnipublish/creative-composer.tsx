'use client';

import { Braces, Check, Code2, Film, ImageIcon, LayoutTemplate, LoaderCircle, Monitor, MousePointerClick, Quote, Save, Smartphone, Sparkles, Tablet, Upload, WandSparkles } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useRef, useState, useTransition } from 'react';

import { prepareCommunicationMediaUpload, registerCommunicationMediaAsset, saveCommunicationComponent } from '@/features/admin/actions/omnipublish';
import type { CommunicationComponent, CommunicationMediaAsset } from '@/features/admin/omnipublish/types';
import { buildOmniPublishSandboxDocument } from '@/features/admin/omnipublish/render-code-page';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/cn';

type ComposerTab = 'blocks' | 'code' | 'media' | 'icons';
type CodeValue = { html: string; css: string; js: string };

const iconLibrary = [
  { name: 'Sparkles', path: '<path d="m12 3-1.7 4.3L6 9l4.3 1.7L12 15l1.7-4.3L18 9l-4.3-1.7L12 3Z"/><path d="m5 16-.8 2.2L2 19l2.2.8L5 22l.8-2.2L8 19l-2.2-.8L5 16Z"/>' },
  { name: 'Livro', path: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>' },
  { name: 'Caneta', path: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/>' },
  { name: 'Raio', path: '<path d="m13 2-9 12h8l-1 8 9-12h-8Z"/>' },
  { name: 'Seta', path: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>' },
  { name: 'Check', path: '<path d="m20 6-11 11-5-5"/>' },
];

function iconMarkup(icon: (typeof iconLibrary)[number]) {
  return `<svg class="op-inline-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${icon.name}">${icon.path}</svg>`;
}

export function CreativeComposer({ value, onChange, initialComponents, initialAssets }: { value: CodeValue; onChange: (value: CodeValue) => void; initialComponents: CommunicationComponent[]; initialAssets: CommunicationMediaAsset[] }) {
  const [tab, setTab] = useState<ComposerTab>('blocks');
  const [components, setComponents] = useState(initialComponents);
  const [assets, setAssets] = useState(initialAssets);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaAlt, setMediaAlt] = useState('');
  const [mediaCaption, setMediaCaption] = useState('');
  const [notice, setNotice] = useState('');
  const [componentName, setComponentName] = useState('');
  const [componentCategory, setComponentCategory] = useState('custom');
  const [savingComponent, startSavingComponent] = useTransition();
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const fileRef = useRef<HTMLInputElement>(null);

  const srcDoc = useMemo(() => buildOmniPublishSandboxDocument(value), [value]);

  function insertComponent(component: CommunicationComponent) {
    onChange({ html: `${value.html}\n${component.html_code}`.trim(), css: `${value.css}\n${component.css_code}`.trim(), js: `${value.js}\n${component.js_code}`.trim() });
    setNotice(`${component.name} adicionado à composição.`);
  }

  function insertAsset(asset: CommunicationMediaAsset) {
    const media = asset.media_type === 'video'
      ? `<figure class="op-media"><video src="${asset.public_url}" controls playsinline aria-label="${escapeAttribute(asset.alt_text || asset.title)}"></video>${asset.caption ? `<figcaption>${escapeHtml(asset.caption)}</figcaption>` : ''}</figure>`
      : `<figure class="op-media"><img src="${asset.public_url}" alt="${escapeAttribute(asset.alt_text)}" loading="lazy">${asset.caption ? `<figcaption>${escapeHtml(asset.caption)}</figcaption>` : ''}</figure>`;
    onChange({ ...value, html: `${value.html}\n${media}`.trim(), css: `${value.css}\n.op-media{margin:2rem 0}.op-media img,.op-media video{display:block;width:100%;border-radius:20px}.op-media figcaption{margin-top:.65rem;color:#68716b;font:.8rem/1.5 system-ui}`.trim() });
    setNotice('Mídia inserida no HTML.');
  }

  async function upload(file: File) {
    setUploading(true); setNotice('Preparando mídia…');
    try {
      if (!mediaAlt.trim()) throw new Error('Informe uma descrição acessível para a mídia.');
      const prepared = await prepareCommunicationMediaUpload({ fileName: file.name, mimeType: file.type, size: file.size });
      const supabase = createClient();
      const result = await supabase.storage.from('omnipublish-media').uploadToSignedUrl(prepared.path, prepared.token, file, { contentType: file.type });
      if (result.error) throw result.error;
      const asset = await registerCommunicationMediaAsset({ uploadId: prepared.uploadId, path: prepared.path, fileName: file.name, mimeType: file.type, size: file.size, title: mediaTitle.trim() || file.name.replace(/\.[^.]+$/, ''), altText: mediaAlt.trim(), caption: mediaCaption.trim() });
      setAssets((current) => [asset, ...current]);
      insertAsset(asset);
      setNotice('Upload concluído e mídia inserida.'); setSelectedFile(null); setMediaTitle(''); setMediaAlt(''); setMediaCaption('');
    } catch (reason) { setNotice(reason instanceof Error ? reason.message : 'Não foi possível enviar a mídia.'); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  }

  function saveAsComponent() {
    startSavingComponent(async () => {
      try {
        const component = await saveCommunicationComponent({ name: componentName, description: 'Componente criado no estúdio visual.', category: componentCategory, htmlCode: value.html, cssCode: value.css, jsCode: value.js });
        setComponents((current) => [component, ...current]); setComponentName(''); setNotice('Componente reutilizável guardado.');
      } catch (reason) { setNotice(reason instanceof Error ? reason.message : 'Não foi possível guardar o componente.'); }
    });
  }

  return <section className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface" aria-label="Estúdio visual da publicação">
    <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center"><div className="flex size-10 items-center justify-center rounded-xl bg-accent-subtle text-accent"><Code2 className="size-5" /></div><div><h3 className="font-serif text-lg font-semibold">Canvas de experiência</h3><p className="text-xs text-muted">HTML, CSS, motion e mídia em uma prévia isolada.</p></div><div className="ml-auto flex gap-1 overflow-x-auto rounded-xl bg-surface-muted p-1">{([['blocks', 'Blocos', LayoutTemplate], ['code', 'Código', Braces], ['media', 'Mídia', ImageIcon], ['icons', 'Ícones', Sparkles]] as const).map(([key, label, Icon]) => <button key={key} type="button" onClick={() => setTab(key)} className={cn('flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-medium', tab === key ? 'bg-surface text-accent shadow-soft' : 'text-muted hover:text-ink')}><Icon className="size-3.5" />{label}</button>)}</div></div>
    <div className="grid xl:grid-cols-[minmax(22rem,.85fr)_minmax(25rem,1.15fr)]">
      <div className="min-h-[32rem] border-b border-line p-4 sm:p-5 xl:border-b-0 xl:border-r">
        {tab === 'blocks' && <div><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-accent">Design system editorial</p><h4 className="mt-1 text-sm font-semibold">Componentes reutilizáveis</h4></div><WandSparkles className="size-4 text-muted" /></div><div className="mt-4 grid gap-3 sm:grid-cols-2">{components.map((component) => <button key={component.id} type="button" onClick={() => insertComponent(component)} className="group rounded-xl border border-line bg-editor p-4 text-left hover:border-accent"><span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-accent">{component.is_official ? <Check className="size-3" /> : <Code2 className="size-3" />}{component.is_official ? 'Oficial' : 'Personalizado'}</span><strong className="mt-3 block font-serif text-base text-ink">{component.name}</strong><span className="mt-1 block text-xs leading-relaxed text-muted">{component.description}</span><span className="mt-3 inline-flex text-[10px] font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">Adicionar ao canvas</span></button>)}</div><div className="mt-5 rounded-xl border border-dashed border-line p-4"><p className="text-xs font-semibold">Guardar composição atual como componente</p><div className="mt-3 grid gap-2 sm:grid-cols-[1fr_9rem_auto]"><input value={componentName} onChange={(event) => setComponentName(event.target.value)} placeholder="Nome do componente" className="min-h-10 rounded-lg border border-line bg-editor px-3 text-xs text-ink" /><select value={componentCategory} onChange={(event) => setComponentCategory(event.target.value)} className="min-h-10 rounded-lg border border-line bg-editor px-2 text-xs text-ink"><option value="custom">Personalizado</option><option value="hero">Hero</option><option value="content">Conteúdo</option><option value="quote">Citação</option><option value="cta">CTA</option><option value="footer">Footer</option><option value="motion">Motion</option></select><button type="button" onClick={saveAsComponent} disabled={savingComponent || !componentName.trim()} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-accent px-3 text-xs font-semibold text-on-accent disabled:opacity-50">{savingComponent ? <LoaderCircle className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}Salvar</button></div></div></div>}
        {tab === 'code' && <div className="space-y-4"><CodeEditor label="HTML semântico" language="HTML" value={value.html} onChange={(html) => onChange({ ...value, html })} rows={12} /><CodeEditor label="CSS isolado" language="CSS" value={value.css} onChange={(css) => onChange({ ...value, css })} rows={10} /><CodeEditor label="JavaScript da experiência" language="JS" value={value.js} onChange={(js) => onChange({ ...value, js })} rows={8} /><p className="rounded-lg bg-warning-subtle p-3 text-[11px] leading-relaxed text-warning">O JavaScript roda somente dentro da prévia isolada e não recebe acesso à sessão, ao Admin ou ao DOM da plataforma.</p></div>}
        {tab === 'media' && <div><button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="flex min-h-28 w-full flex-col items-center justify-center rounded-xl border border-dashed border-accent/35 bg-accent-subtle text-accent hover:border-accent disabled:opacity-60">{uploading ? <LoaderCircle className="size-5 animate-spin" /> : <Upload className="size-5" />}<span className="mt-2 text-xs font-semibold">{uploading ? 'Enviando…' : 'Imagem, GIF ou vídeo do dispositivo'}</span><span className="mt-1 text-[10px] text-muted">JPG, PNG, WebP, AVIF, GIF, MP4 ou WebM · até 50 MB</span></button><input ref={fileRef} type="file" className="sr-only" accept="image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm" onChange={(event) => { const file = event.target.files?.[0] ?? null; setSelectedFile(file); if (file) setMediaTitle(file.name.replace(/\.[^.]+$/, '')); }} />{selectedFile && <div className="mt-4 rounded-xl border border-line bg-editor p-4"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-accent-subtle text-accent">{selectedFile.type.startsWith('video/') ? <Film className="size-4" /> : <ImageIcon className="size-4" />}</span><div className="min-w-0"><p className="truncate text-xs font-semibold text-ink">{selectedFile.name}</p><p className="text-[10px] text-muted">{(selectedFile.size / 1048576).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB</p></div></div><div className="mt-4 grid gap-3"><label className="text-[10px] font-medium text-muted">Título<input value={mediaTitle} onChange={(event) => setMediaTitle(event.target.value)} className="mt-1 min-h-9 w-full rounded-lg border border-line bg-surface px-3 text-xs text-ink" /></label><label className="text-[10px] font-medium text-muted">Descrição acessível<input value={mediaAlt} onChange={(event) => setMediaAlt(event.target.value)} placeholder="O que aparece nesta mídia?" className="mt-1 min-h-9 w-full rounded-lg border border-line bg-surface px-3 text-xs text-ink" /></label><label className="text-[10px] font-medium text-muted">Legenda opcional<input value={mediaCaption} onChange={(event) => setMediaCaption(event.target.value)} className="mt-1 min-h-9 w-full rounded-lg border border-line bg-surface px-3 text-xs text-ink" /></label><button type="button" onClick={() => void upload(selectedFile)} disabled={uploading || !mediaAlt.trim()} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-accent px-3 text-xs font-semibold text-on-accent disabled:opacity-50"><Upload className="size-3.5" />Enviar e inserir no canvas</button></div></div>}<div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{assets.map((asset) => <button key={asset.id} type="button" onClick={() => insertAsset(asset)} className="group overflow-hidden rounded-xl border border-line bg-editor text-left hover:border-accent">{asset.media_type === 'video' ? <div className="flex aspect-video items-center justify-center bg-surface-muted"><Film className="size-6 text-accent" /></div> : <Image src={asset.public_url} alt={asset.alt_text} width={320} height={180} unoptimized className="aspect-video w-full object-cover" />}<span className="block truncate p-2 text-[10px] font-medium text-muted group-hover:text-accent">{asset.title || asset.file_name}</span></button>)}</div></div>}
        {tab === 'icons' && <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-accent">Biblioteca vetorial</p><h4 className="mt-1 text-sm font-semibold">Ícones leves e acessíveis</h4><div className="mt-5 grid grid-cols-3 gap-3">{iconLibrary.map((icon) => <button key={icon.name} type="button" onClick={() => { onChange({ ...value, html: `${value.html}\n${iconMarkup(icon)}`.trim() }); setNotice(`${icon.name} inserido no HTML.`); }} className="flex min-h-24 flex-col items-center justify-center rounded-xl border border-line bg-editor text-muted hover:border-accent hover:text-accent"><span dangerouslySetInnerHTML={{ __html: iconMarkup(icon) }} /><span className="mt-2 text-[10px] font-medium">{icon.name}</span></button>)}</div><div className="mt-5 grid gap-3 sm:grid-cols-2"><QuickInsert icon={Quote} label="Citação" onClick={() => onChange({ ...value, html: `${value.html}\n<blockquote class="op-callout">“Escreva aqui a citação.”<cite>— Autoria</cite></blockquote>` })} /><QuickInsert icon={MousePointerClick} label="Botão com link" onClick={() => onChange({ ...value, html: `${value.html}\n<a class="op-button" href="https://" target="_blank" rel="noopener">Abrir recurso</a>` })} /></div></div>}
        {notice && <p className="mt-4 rounded-lg bg-accent-subtle px-3 py-2 text-[11px] text-accent" role="status">{notice}</p>}
      </div>
      <div className="bg-[#e9ece8] p-3 sm:p-5"><div className="flex items-center justify-between gap-3 px-1 pb-3"><div className="flex gap-1.5" aria-hidden="true"><span className="size-2.5 rounded-full bg-danger/55" /><span className="size-2.5 rounded-full bg-warning/55" /><span className="size-2.5 rounded-full bg-success/55" /></div><div className="flex items-center gap-1 rounded-lg bg-white/70 p-1">{([['desktop', Monitor, 'Desktop'], ['tablet', Tablet, 'Tablet'], ['mobile', Smartphone, 'Celular']] as const).map(([key, Icon, label]) => <button key={key} type="button" onClick={() => setViewport(key)} aria-label={`Visualizar em ${label}`} title={label} className={cn('flex size-7 items-center justify-center rounded-md', viewport === key ? 'bg-accent text-on-accent' : 'text-[#647067] hover:bg-white')}><Icon className="size-3.5" /></button>)}</div><span className="hidden text-[10px] font-medium uppercase tracking-wider text-[#647067] sm:inline">Preview sandbox</span></div><div className={cn('mx-auto transition-[max-width] duration-300', viewport === 'desktop' ? 'max-w-none' : viewport === 'tablet' ? 'max-w-[48rem]' : 'max-w-[24rem]')}><iframe title="Prévia isolada da publicação" sandbox="allow-scripts" srcDoc={srcDoc} className="h-[44rem] w-full rounded-xl border border-[#d7ddd8] bg-white shadow-floating" /></div></div>
    </div>
  </section>;
}

function CodeEditor({ label, language, value, onChange, rows }: { label: string; language: string; value: string; onChange: (value: string) => void; rows: number }) {
  return <label className="block"><span className="flex items-center justify-between text-xs font-medium text-muted"><span>{label}</span><code className="rounded bg-surface-muted px-1.5 py-0.5 text-[9px] text-accent">{language}</code></span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={rows} spellCheck={false} className="mt-2 w-full resize-y rounded-xl border border-line bg-[#171b18] p-3 font-mono text-[11px] leading-relaxed text-[#dbe8de] outline-none focus:border-accent" /></label>;
}

function QuickInsert({ icon: Icon, label, onClick }: { icon: typeof Quote; label: string; onClick: () => void }) { return <button type="button" onClick={onClick} className="flex min-h-12 items-center gap-3 rounded-xl border border-line bg-editor px-3 text-left text-xs font-medium text-ink hover:border-accent"><Icon className="size-4 text-accent" />{label}</button>; }

function escapeHtml(value: string) { return value.replace(/[&<>]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[character] ?? character); }
function escapeAttribute(value: string) { return escapeHtml(value).replace(/"/g, '&quot;'); }
