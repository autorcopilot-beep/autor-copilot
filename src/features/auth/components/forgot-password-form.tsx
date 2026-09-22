'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Check, LoaderCircle } from 'lucide-react';

import { Button, Input, Label } from '@/components/ui';
import { requestPasswordReset } from '@/features/auth/actions/password';
import type { ForgotPasswordState } from '@/features/auth/schemas/password';

const initialState: ForgotPasswordState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="wide" className="w-full" disabled={pending}>
      {pending ? <><LoaderCircle className="size-4 animate-spin" aria-hidden="true" />Enviando…</> : 'Enviar link seguro'}
    </Button>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(requestPasswordReset, initialState);

  if (state.status === 'success') {
    return (
      <div className="mt-8 rounded-card border border-line bg-accent-subtle p-5" role="status">
        <span className="flex size-9 items-center justify-center rounded-full bg-surface text-success">
          <Check className="size-4" aria-hidden="true" />
        </span>
        <p className="mt-4 font-medium text-ink">Confira sua caixa de entrada</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      {state.message && <div className="rounded-control border border-danger bg-danger-subtle px-4 py-3 text-sm text-ink" role="alert">{state.message}</div>}
      <div>
        <Label htmlFor="email">E-mail da conta</Label>
        <Input
          id="email"
          name="email"
          type="email"
          className="mt-2"
          autoComplete="email"
          inputMode="email"
          maxLength={254}
          defaultValue={state.email}
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={state.fieldErrors?.email ? 'email-error' : 'email-hint'}
          required
          autoFocus
        />
        {state.fieldErrors?.email?.[0] ? (
          <p id="email-error" className="mt-1.5 text-sm text-danger">{state.fieldErrors.email[0]}</p>
        ) : (
          <p id="email-hint" className="mt-1.5 text-sm text-muted">Enviaremos as mesmas instruções, exista ou não uma conta.</p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}
