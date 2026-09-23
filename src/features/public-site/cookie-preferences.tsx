'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CONSENT_COOKIE, CONSENT_MAX_AGE, makeConsent, readConsent, type Consent, type OptionalCategory } from './consent';

const denied = { preferences: false, analytics: false, marketing: false };
export function openCookiePreferences() { window.dispatchEvent(new Event('ac:open-cookie-preferences')); }

/** Optional integrations must mount inside this gate, never before consent. */
export function ConsentGate({ category, children, fallback = null }: { category: OptionalCategory; children: React.ReactNode; fallback?: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const update = () => setAllowed(readConsent()?.[category] === true);
    update();
    window.addEventListener('ac:consent-changed', update);
    window.addEventListener('focus', update);
    const timer = window.setInterval(update, 60000);
    return () => { window.clearInterval(timer); window.removeEventListener('ac:consent-changed', update); window.removeEventListener('focus', update); };
  }, [category]);
  return allowed ? children : fallback;
}

export function CookiePreferences() {
  const [ready, setReady] = useState(false);
  const [consent, setConsent] = useState<Consent | null>(null);
  const [open, setOpen] = useState(false);
  const [choices, setChoices] = useState(denied);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const refresh = () => { const saved = readConsent(); setConsent(saved); setChoices(saved ?? denied); setReady(true); };
    const show = () => { setChoices(readConsent() ?? denied); setOpen(true); };
    const sync = (event: StorageEvent) => { if (event.key === 'ac:consent-sync') { refresh(); window.dispatchEvent(new Event('ac:consent-changed')); } };
    refresh();
    window.addEventListener('ac:open-cookie-preferences', show);
    window.addEventListener('storage', sync);
    window.addEventListener('focus', refresh);
    return () => { window.removeEventListener('ac:open-cookie-preferences', show); window.removeEventListener('storage', sync); window.removeEventListener('focus', refresh); };
  }, []);
  function save(next: typeof denied) {
    const value = makeConsent(next);
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Path=/; Max-Age=${CONSENT_MAX_AGE}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
    if (!readConsent()) { setMessage('O navegador bloqueou o armazenamento. Os cookies opcionais continuam desativados.'); return; }
    setConsent(value); setOpen(false); setMessage('Preferências de cookies salvas.');
    window.dispatchEvent(new CustomEvent('ac:consent-changed', { detail: value }));
    try { localStorage.setItem('ac:consent-sync', String(value.updatedAt)); } catch { /* The consent cookie remains the source of truth. */ }
  }
  return <>
    <span className="sr-only" role="status">{message}</span>
    {ready && !consent && !open && <aside className="ac-cookie-banner" aria-label="Sua privacidade"><Cookie size={24} /><div><strong>Seu espaço. Suas escolhas.</strong><p>Usamos armazenamento essencial para a plataforma funcionar. Você decide sobre preferências, análise e marketing.</p><Link href="/cookies">Ver detalhes dos cookies</Link></div><div className="ac-cookie-actions"><button onClick={() => save(denied)}>Só essenciais</button><button onClick={() => setOpen(true)}>Personalizar</button><button className="ac-button" onClick={() => save({ preferences: true, analytics: true, marketing: true })}>Aceitar todos</button></div></aside>}
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="ac-cookie-dialog max-h-[85dvh] overflow-y-auto !border-line !bg-surface !text-ink" showCloseButton={false}>
      <ShieldCheck className="text-accent" /><DialogTitle className="font-serif text-2xl">Privacidade, do seu jeito.</DialogTitle><DialogDescription className="!text-muted">Escolha quais categorias autorizar. Você pode retirar o consentimento pelo rodapé. A escolha vale por 180 dias neste navegador.</DialogDescription>
      <div className="rounded-xl border border-line p-4"><strong>Essenciais · sempre ativos</strong><p className="mt-2 text-sm text-muted">Sessão, segurança e registro da escolha de cookies. Não são usados para publicidade.</p></div>
      {([['preferences', 'Preferências', 'Permite integrações opcionais de personalização. As configurações que você solicita na conta são tratadas separadamente.'], ['analytics', 'Análise de uso', 'Autoriza ferramentas opcionais de medição. Nenhum provedor de analytics está conectado nesta versão.'], ['marketing', 'Marketing e mídia externa', 'Autoriza integrações opcionais de campanhas. Nenhum pixel de publicidade está conectado nesta versão.']] as const).map(([key, title, description]) => <label key={key} className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4"><input className="mt-1 size-5 accent-[#356b55]" type="checkbox" checked={choices[key]} onChange={(event) => setChoices({ ...choices, [key]: event.target.checked })} /><span><strong>{title}</strong><span className="mt-1 block text-sm text-muted">{description}</span></span></label>)}
      <Link className="text-sm underline" href="/cookies" onClick={() => setOpen(false)}>Inventário e detalhes de armazenamento</Link>
      <div className="flex flex-wrap gap-2"><button className="ac-button" onClick={() => save(choices)}>Salvar escolhas</button><button className="ac-button-secondary" onClick={() => save(denied)}>Recusar opcionais</button><button className="ac-button-secondary" onClick={() => setOpen(false)}>Fechar</button></div>
    </DialogContent></Dialog>
  </>;
}
