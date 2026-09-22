'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { LoaderCircle, LockKeyhole } from 'lucide-react';

import { Button, Input, Label } from '@/components/ui';
import { adminLogin } from '@/features/admin/actions/login';
import type { LoginState } from '@/features/auth/schemas/login';
import { PasswordField } from '@/features/auth/components/password-field';

const initialState: LoginState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="wide" className="w-full" disabled={pending}>
      {pending ? <><LoaderCircle className="size-4 animate-spin" aria-hidden="true" />Validando acesso…</> : <><LockKeyhole className="size-4" aria-hidden="true" />Entrar no Admin Center</>}
    </Button>
  );
}

export function AdminLoginForm() {
  const [state, formAction] = useActionState(adminLogin, initialState);
  return (
    <form action={formAction} className="mt-8 space-y-5 [&_label]:text-white/70" noValidate>
      {state.message && <div className="rounded-control border border-danger bg-danger-subtle px-4 py-3 text-sm text-ink" role="alert">{state.message}</div>}
      <div>
        <Label htmlFor="admin-email">E-mail administrativo</Label>
        <Input id="admin-email" name="email" type="email" className="mt-2" autoComplete="email" defaultValue={state.email} aria-invalid={Boolean(state.fieldErrors?.email)} required autoFocus />
        {state.fieldErrors?.email?.[0] && <p className="mt-1.5 text-sm text-danger">{state.fieldErrors.email[0]}</p>}
      </div>
      <PasswordField id="admin-password" name="password" label="Senha" autoComplete="current-password" error={state.fieldErrors?.password?.[0]} />
      <SubmitButton />
    </form>
  );
}
