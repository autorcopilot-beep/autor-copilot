'use client';

import { useMemo, useState } from 'react';
import { Code2, Eye } from 'lucide-react';

function escapeClosingScript(value: string) {
  return value.replace(/<\/script/gi, '<\\/script');
}

function hydrate(template: string, values: Record<string, string>) {
  return template.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key: string) => values[key] ?? '');
}

export function GuideCodePreview({ html, css, js, title, message, actionLabel }: { html: string; css: string; js: string; title: string; message: string; actionLabel: string }) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const values = useMemo(() => ({ eyebrow: 'Guia do produto', title, message, action: actionLabel || 'Continuar' }), [actionLabel, message, title]);
  const srcDoc = useMemo(() => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>html,body{margin:0;padding:10px;background:transparent}${escapeClosingScript(css)}</style></head><body>${hydrate(html, values)}<script>try{${escapeClosingScript(js)}}catch(error){document.body.dataset.previewError=String(error)}<\/script></body></html>`, [css, html, js, values]);
  return <div className="overflow-hidden rounded-xl border border-line bg-surface sm:col-span-2"><div className="flex items-center justify-between border-b border-line px-3 py-2"><span className="text-[10px] font-bold uppercase tracking-wider text-accent">Preview isolado</span><div className="flex gap-1"><button type="button" onClick={() => setTab('preview')} className="rounded-lg p-1.5 text-muted hover:bg-surface-muted" aria-label="Ver preview"><Eye className="size-3.5" /></button><button type="button" onClick={() => setTab('code')} className="rounded-lg p-1.5 text-muted hover:bg-surface-muted" aria-label="Ver código"><Code2 className="size-3.5" /></button></div></div>{tab === 'preview' ? <iframe title={`Preview de ${title}`} sandbox="allow-scripts" srcDoc={srcDoc} className="h-64 w-full bg-editor" /> : <pre className="max-h-64 overflow-auto p-4 text-[11px] text-muted"><code>{html || 'Use um template ou escreva HTML no campo abaixo.'}</code></pre>}</div>;
}
