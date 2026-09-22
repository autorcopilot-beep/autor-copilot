'use client';

import { CheckCircle2, Clock3, KeyRound, LoaderCircle, LockKeyhole, Mail, Pencil, ShieldCheck, X } from 'lucide-react';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button, Input, Label } from '@/components/ui';
import { updateLoginEmail } from '@/features/account/actions/update-login-email';
import type { LoginEmailState } from '@/features/account/schemas/login-email';

const initialState: LoginEmailState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? <><LoaderCircle className="size-4 animate-spin" />Enviando…</> : 'Confirmar novo e-mail'}</Button>;
}

function formatDate(value?: string) {
  if (!value) return 'Não disponível';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(value));
}

export function LoginEmailSettings({ email, confirmedAt, lastSignInAt, provider, notice }: { email: string; confirmedAt?: string; lastSignInAt?: string; provider: string; notice?: 'requested' | 'confirmed' | 'error' }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction] = useActionState(updateLoginEmail, initialState);

  return (
    <div className="space-y-7">
      {notice === 'requested' && <div className="flex items-start gap-3 rounded-control border border-success bg-success-subtle px-4 py-3 text-sm text-ink" role="status"><Mail className="mt-0.5 size-4 shrink-0 text-success" /><span>Solicitação enviada. Confira as caixas de entrada envolvidas para confirmar a alteração.</span></div>}
      {notice === 'confirmed' && <div className="flex items-start gap-3 rounded-control border border-success bg-success-subtle px-4 py-3 text-sm text-ink" role="status"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /><span>Novo endereço confirmado. Ele já pode ser usado no próximo login.</span></div>}
      {notice === 'error' && <div className="flex items-start gap-3 rounded-control border border-danger bg-danger-subtle px-4 py-3 text-sm text-ink" role="alert"><Mail className="mt-0.5 size-4 shrink-0 text-danger" /><span>O link de confirmação é inválido ou expirou. Solicite a alteração novamente.</span></div>}

      <section className="border-b border-line pb-7" aria-labelledby="login-email-title">
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1"><h2 id="login-email-title" className="font-serif text-xl font-semibold text-ink">E-mail de acesso</h2><p className="mt-1 text-sm leading-relaxed text-muted">Este endereço identifica sua conta e recebe mensagens de segurança.</p></div>
          {!editing && <Button type="button" variant="ghost" size="icon" className="-mr-2 -mt-2" onClick={() => setEditing(true)} aria-label="Editar e-mail de acesso" title="Editar e-mail"><Pencil className="size-4" /></Button>}
        </div>

        {!editing ? (
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent"><Mail className="size-4.5" /></span>
            <div className="min-w-0 flex-1"><p className="break-all text-sm font-medium text-ink">{email}</p><p className={`mt-1 flex items-center gap-1.5 text-xs ${confirmedAt ? 'text-success' : 'text-warning'}`}><CheckCircle2 className="size-3.5" />{confirmedAt ? 'Endereço confirmado' : 'Confirmação pendente'}</p></div>
          </div>
        ) : (
          <form action={formAction} className="mt-6" noValidate>
            {state.message && <div className="mb-4 rounded-control border border-danger bg-danger-subtle px-4 py-3 text-sm text-ink" role="alert">{state.message}</div>}
            <div className="max-w-xl"><Label htmlFor="email">Novo e-mail</Label><Input id="email" name="email" type="email" defaultValue={email} className="mt-2" autoComplete="email" aria-invalid={Boolean(state.fieldErrors?.email)} required /><p className="mt-2 text-xs leading-relaxed text-muted">O endereço atual continuará ativo até a confirmação da mudança.</p>{state.fieldErrors?.email?.[0] && <p className="mt-1.5 text-sm text-danger">{state.fieldErrors.email[0]}</p>}</div>
            <div className="mt-6 flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="ghost" onClick={() => setEditing(false)}><X className="size-4" />Descartar alterações</Button><SubmitButton /></div>
          </form>
        )}
      </section>

      <section className="border-b border-line pb-7" aria-labelledby="login-method-title">
        <h2 id="login-method-title" className="font-serif text-xl font-semibold text-ink">Método de entrada</h2>
        <p className="mt-1 text-sm text-muted">Como sua identidade é validada no Autor Copilot.</p>
        <dl className="mt-6 grid gap-5 sm:grid-cols-2">
          <div><dt className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Provedor principal</dt><dd className="mt-2 flex items-center gap-2 text-sm font-medium text-ink"><ShieldCheck className="size-4 text-success" />{provider === 'email' ? 'E-mail e senha' : provider}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">E-mail confirmado em</dt><dd className="mt-2 text-sm text-ink">{formatDate(confirmedAt)}</dd></div>
        </dl>
      </section>

      <section className="border-b border-line pb-7" aria-labelledby="login-activity-title">
        <h2 id="login-activity-title" className="font-serif text-xl font-semibold text-ink">Atividade de acesso</h2>
        <div className="mt-5 flex items-start gap-3"><Clock3 className="mt-0.5 size-4 text-accent" /><div><p className="text-sm font-medium text-ink">Último login</p><p className="mt-1 text-sm text-muted">{formatDate(lastSignInAt)}</p></div></div>
      </section>

      <section className="flex items-center gap-4 pb-2" aria-labelledby="login-password-title">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-muted"><KeyRound className="size-4" /></span>
        <div className="min-w-0 flex-1"><h2 id="login-password-title" className="text-sm font-medium text-ink">Senha e segurança</h2><p className="mt-1 text-xs text-muted">Alteração de senha, MFA e eventos de segurança terão uma área dedicada.</p></div>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted"><LockKeyhole className="size-3" />Em breve</span>
      </section>
    </div>
  );
}
