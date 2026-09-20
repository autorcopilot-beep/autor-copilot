'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { LoaderCircle } from 'lucide-react';

import { Button, Input, Label } from '@/components/ui';
import { login } from '@/features/auth/actions/login';
import type { LoginState } from '@/features/auth/schemas/login';
import { PasswordField } from './password-field';

const initialState: LoginState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="wide" className="w-full" disabled={pending}>
      {pending ? (
        <><LoaderCircle className="size-4 animate-spin" aria-hidden="true" />Retomando sua escrita…</>
      ) : 'Entrar no meu espaço'}
    </Button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      <input type="hidden" name="next" value={next ?? ''} />

      {state.message && (
        <div className="rounded-control border border-danger bg-danger-subtle px-4 py-3 text-sm text-ink" role="alert">
          {state.message}
        </div>
      )}

      <div>
        <Label htmlFor="email">E-mail</Label>
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
          aria-describedby={state.fieldErrors?.email ? 'email-error' : undefined}
          required
          autoFocus
        />
        {state.fieldErrors?.email?.[0] && <p id="email-error" className="mt-1.5 text-sm text-danger">{state.fieldErrors.email[0]}</p>}
      </div>

      <div>
        <PasswordField
          id="password"
          label="Senha"
          autoComplete="current-password"
          error={state.fieldErrors?.password?.[0]}
        />
        <div className="mt-2 text-right"><Link href="/forgot-password" className="text-sm font-medium text-accent hover:underline">Esqueci a senha</Link></div>
      </div>

      <SubmitButton />
    </form>
  );
}
