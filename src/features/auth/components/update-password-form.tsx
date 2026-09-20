'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui';
import { updatePassword } from '@/features/auth/actions/password';
import type { UpdatePasswordState } from '@/features/auth/schemas/password';
import { PasswordField } from './password-field';

const initialState: UpdatePasswordState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="wide" className="w-full" disabled={pending}>
      {pending ? <><LoaderCircle className="size-4 animate-spin" aria-hidden="true" />Protegendo sua conta…</> : 'Salvar nova senha'}
    </Button>
  );
}

export function UpdatePasswordForm() {
  const [state, formAction] = useActionState(updatePassword, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      {state.message && <div className="rounded-control border border-danger bg-danger-subtle px-4 py-3 text-sm text-ink" role="alert">{state.message}</div>}
      <PasswordField
        id="password"
        label="Nova senha"
        autoComplete="new-password"
        error={state.fieldErrors?.password?.[0]}
        hint="Pelo menos 8 caracteres, com uma letra e um número."
      />
      <PasswordField
        id="confirmPassword"
        label="Repita a nova senha"
        autoComplete="new-password"
        error={state.fieldErrors?.confirmPassword?.[0]}
      />
      <SubmitButton />
    </form>
  );
}
