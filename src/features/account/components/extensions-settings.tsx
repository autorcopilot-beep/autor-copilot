'use client';

import { AtSign, BadgeCheck, BarChart3, Check, Cloud, Eye, EyeOff, Plug, Puzzle, Tags, Unplug } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  defaultMentionExtensionSettings,
  mentionExtensionStorageKey,
  parseMentionExtensionSettings,
  type MentionExtensionSettings,
} from '@/features/extensions/mention-settings';
import { cn } from '@/lib/cn';

function Toggle({ checked, disabled, onChange }: { checked: boolean; disabled: boolean; onChange: (checked: boolean) => void }) {
  return <label className="inline-flex shrink-0 cursor-pointer items-center"><span className="sr-only">{checked ? 'Desativar' : 'Ativar'}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} disabled={disabled} className="peer sr-only" /><span className="relative h-5 w-9 rounded-full bg-line-strong transition-colors peer-checked:bg-accent peer-disabled:opacity-50 after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4" aria-hidden="true" /></label>;
}

export function ExtensionsSettings() {
  const [settings, setSettings] = useState(defaultMentionExtensionSettings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      setSettings(parseMentionExtensionSettings(window.localStorage.getItem(mentionExtensionStorageKey)));
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  function updateSettings(changes: Partial<MentionExtensionSettings>) {
    const next = { ...settings, ...changes };
    setSettings(next);
    window.localStorage.setItem(mentionExtensionStorageKey, JSON.stringify(next));
  }

  const options = [
    { key: 'verifyReferences' as const, icon: BadgeCheck, title: 'Verificar citações e vínculos', description: 'Sinaliza menções que apontam para entradas removidas ou indisponíveis.' },
    { key: 'showCounts' as const, icon: BarChart3, title: 'Contagens do capítulo', description: 'Mostra total de referências, entidades únicas e distribuição por tipo.' },
    { key: 'showMetadata' as const, icon: Tags, title: 'Metadados no Inspetor', description: 'Exibe tipo, aliases e última atualização da entidade selecionada.' },
    { key: 'openContextOnClick' as const, icon: Eye, title: 'Abrir contexto ao clicar', description: 'Selecionar uma menção abre imediatamente sua ficha contextual.' },
  ];

  return (
    <div className="space-y-8">
      <section className="border-b border-line pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Recursos modulares</p>
        <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">Extensões, plugins e conectores</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">Escolha o que participa da sua experiência de escrita. Extensões ampliam o editor; plugins adicionam ferramentas; conectores ligam serviços externos.</p>
      </section>

      <section aria-labelledby="extensions-title">
        <div className="flex items-center gap-2"><Puzzle className="size-4 text-accent" /><h3 id="extensions-title" className="font-serif text-xl font-semibold text-ink">Extensões do editor</h3></div>
        <article className="mt-4 overflow-hidden rounded-card border border-line bg-editor">
          <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-center">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent"><AtSign className="size-5" /></span>
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h4 className="font-medium text-ink">Contexto por @</h4><span className="rounded-full bg-success-subtle px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success">Instalada</span></div><p className="mt-1 text-sm leading-relaxed text-muted">Vincula o manuscrito à Enciclopédia e mantém informações de continuidade perto do texto.</p></div>
            <div className="inline-flex min-h-10 shrink-0 items-center gap-3 rounded-control border border-line px-3 text-sm font-medium text-ink"><span>{settings.enabled ? 'Ativa' : 'Inativa'}</span><Toggle checked={settings.enabled} disabled={!hydrated} onChange={(enabled) => updateSettings({ enabled })} /></div>
          </div>

          <div className={cn('p-5 transition-opacity', !settings.enabled && 'pointer-events-none opacity-45')}>
            <fieldset disabled={!settings.enabled || !hydrated}>
              <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Visualização no manuscrito</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className={cn('cursor-pointer rounded-control border p-4 transition-colors', settings.appearance === 'highlighted' ? 'border-accent bg-accent-subtle' : 'border-line bg-surface hover:border-line-strong')}>
                  <input type="radio" name="mention-appearance" value="highlighted" checked={settings.appearance === 'highlighted'} onChange={() => updateSettings({ appearance: 'highlighted' })} className="sr-only" />
                  <span className="flex items-center gap-2 text-sm font-medium text-ink"><Eye className="size-4 text-accent" />Destacado</span>
                  <span className="mt-3 block font-serif text-sm text-ink">Ela encontrou <mark className="rounded bg-accent-subtle px-1.5 py-0.5 font-sans text-xs font-semibold text-accent">@Amélia</mark> na estação.</span>
                  <span className="mt-2 block text-xs leading-relaxed text-muted">Mostra claramente quais trechos estão vinculados.</span>
                </label>
                <label className={cn('cursor-pointer rounded-control border p-4 transition-colors', settings.appearance === 'plain' ? 'border-accent bg-accent-subtle' : 'border-line bg-surface hover:border-line-strong')}>
                  <input type="radio" name="mention-appearance" value="plain" checked={settings.appearance === 'plain'} onChange={() => updateSettings({ appearance: 'plain' })} className="sr-only" />
                  <span className="flex items-center gap-2 text-sm font-medium text-ink"><EyeOff className="size-4 text-accent" />Texto comum</span>
                  <span className="mt-3 block font-serif text-sm text-ink">Ela encontrou <span className="underline decoration-dotted decoration-muted underline-offset-4">Amélia</span> na estação.</span>
                  <span className="mt-2 block text-xs leading-relaxed text-muted">Oculta o @ e integra a referência à leitura.</span>
                </label>
              </div>
            </fieldset>

            <div className="mt-6 border-t border-line pt-2">
              {options.map(({ key, icon: Icon, title, description }) => <div key={key} className="flex items-start gap-3 border-b border-line py-4 last:border-b-0"><span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-accent"><Icon className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-sm font-medium text-ink">{title}</p><p className="mt-1 text-xs leading-relaxed text-muted">{description}</p></div><Toggle checked={settings[key]} disabled={!settings.enabled || !hydrated} onChange={(checked) => updateSettings({ [key]: checked })} /></div>)}
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-5 border-b border-line pb-8 md:grid-cols-2">
        <article className="rounded-card border border-line bg-surface p-5"><span className="flex size-10 items-center justify-center rounded-full bg-surface-muted text-muted"><Plug className="size-4" /></span><h3 className="mt-4 font-serif text-lg font-semibold text-ink">Plugins</h3><p className="mt-2 text-sm leading-relaxed text-muted">Ferramentas adicionais poderão analisar, revisar ou transformar o manuscrito com permissões explícitas.</p><div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted"><Check className="size-3.5" />Área preparada para o catálogo</div></article>
        <article className="rounded-card border border-line bg-surface p-5"><span className="flex size-10 items-center justify-center rounded-full bg-surface-muted text-muted"><Cloud className="size-4" /></span><h3 className="mt-4 font-serif text-lg font-semibold text-ink">Conectores</h3><p className="mt-2 text-sm leading-relaxed text-muted">Serviços de arquivos, pesquisa e publicação aparecerão aqui quando estiverem disponíveis para conexão.</p><div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted"><Unplug className="size-3.5" />Nenhum serviço conectado</div></article>
      </section>
    </div>
  );
}
