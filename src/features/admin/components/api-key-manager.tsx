'use client';

import { Check, Copy, KeyRound, LoaderCircle, ShieldCheck } from 'lucide-react';
import { useState, useTransition } from 'react';

import { createCommunicationApiKey } from '@/features/admin/actions/omnipublish';

const scopes = [
  ['catalogs:read', 'Ler catálogos'], ['publications:read', 'Ler publicações'],
  ['campaigns:read', 'Ler campanhas'], ['campaigns:write', 'Criar e publicar'],
  ['receipts:write', 'Registrar recibos'],
] as const;

export function ApiKeyManager() {
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>(['catalogs:read', 'publications:read']);
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  function createKey() {
    setError('');
    startTransition(async () => {
      try {
        const result = await createCommunicationApiKey({ name, scopes: selected });
        setToken(result.token);
        setName('');
      } catch (reason) { setError(reason instanceof Error ? reason.message : 'Não foi possível criar a chave.'); }
    });
  }

  async function copy() {
    await navigator.clipboard.writeText(token);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return <section className="rounded-[1.5rem] border border-line bg-surface p-5 shadow-soft sm:p-6"><div className="flex items-start gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-accent-subtle text-accent"><KeyRound className="size-4" /></span><div><h2 className="font-serif text-xl font-semibold">Nova chave de integração</h2><p className="mt-1 text-xs leading-5 text-muted">O segredo completo aparece uma única vez. O banco guarda somente o hash SHA-256.</p></div></div>{token ? <div className="mt-6 rounded-xl border border-success/25 bg-success-subtle p-4"><p className="flex items-center gap-2 text-xs font-semibold text-success"><ShieldCheck className="size-4" />Chave criada. Copie antes de sair desta tela.</p><div className="mt-3 flex gap-2"><code className="min-w-0 flex-1 overflow-x-auto rounded-lg bg-surface px-3 py-3 text-xs text-ink">{token}</code><button type="button" onClick={copy} className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-on-accent" aria-label="Copiar chave">{copied ? <Check className="size-4" /> : <Copy className="size-4" />}</button></div><button type="button" onClick={() => setToken('')} className="mt-3 text-xs font-semibold text-accent">Criar outra chave</button></div> : <><label className="mt-6 block text-xs font-medium text-muted">Nome da integração<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Automação editorial" className="mt-2 min-h-11 w-full rounded-xl border border-line bg-editor px-3 text-sm text-ink outline-none focus:border-accent" /></label><fieldset className="mt-5"><legend className="text-xs font-medium text-muted">Escopos</legend><div className="mt-2 grid gap-2 sm:grid-cols-2">{scopes.map(([scope, label]) => <label key={scope} className="flex min-h-10 items-center gap-2 rounded-xl border border-line bg-editor px-3 text-xs"><input type="checkbox" checked={selected.includes(scope)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, scope] : current.filter((item) => item !== scope))} className="accent-[var(--color-accent)]" />{label}<code className="ml-auto text-[9px] text-muted">{scope}</code></label>)}</div></fieldset>{error && <p className="mt-4 rounded-lg bg-danger-subtle p-3 text-xs text-danger">{error}</p>}<button type="button" onClick={createKey} disabled={pending || name.trim().length < 2 || !selected.length} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-on-accent disabled:opacity-50">{pending ? <LoaderCircle className="size-4 animate-spin" /> : <KeyRound className="size-4" />}Gerar chave</button></>}</section>;
}
