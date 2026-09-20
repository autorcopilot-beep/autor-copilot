'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';

import { Button, Input, Label } from '@/components/ui';
import { register } from '@/features/auth/actions/register';
import type { RegisterField, RegisterState } from '@/features/auth/schemas/register';

const initialState: RegisterState = { status: 'idle' };

function FieldError({ field, state }: { field: RegisterField; state: RegisterState }) {
  const message = state.fieldErrors?.[field]?.[0];

  if (!message) return null;

  return (
    <p id={`${field}-error`} className="mt-1.5 text-sm text-danger">
      {message}
    </p>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="wide" className="mt-2 w-full" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          Abrindo seu espaço…
        </>
      ) : (
        'Criar meu espaço de escrita'
      )}
    </Button>
  );
}

export function RegisterForm({ confirmationError = false }: { confirmationError?: boolean }) {
  const [state, formAction] = useActionState(register, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      {confirmationError && (
        <div className="rounded-control border border-danger bg-danger-subtle px-4 py-3 text-sm text-ink" role="alert">
          O link de confirmação expirou ou já foi utilizado. Crie a conta novamente ou solicite um novo link na próxima etapa.
        </div>
      )}

      {state.message && (
        <div className="rounded-control border border-danger bg-danger-subtle px-4 py-3 text-sm text-ink" role="alert">
          {state.message}
        </div>
      )}

      <div>
        <Label htmlFor="displayName">Como devemos chamar você?</Label>
        <Input
          id="displayName"
          name="displayName"
          className="mt-2"
          autoComplete="name"
          maxLength={80}
          aria-invalid={Boolean(state.fieldErrors?.displayName)}
          aria-describedby={state.fieldErrors?.displayName ? 'displayName-error' : undefined}
          required
        />
        <FieldError field="displayName" state={state} />
      </div>

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
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={state.fieldErrors?.email ? 'email-error' : 'email-hint'}
          required
        />
        <p id="email-hint" className="mt-1.5 text-sm text-muted">
          Você receberá um link para confirmar a conta.
        </p>
        <FieldError field="email" state={state} />
      </div>

      <div>
        <Label htmlFor="password">Senha</Label>
        <div className="relative mt-2">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            className="pr-12"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            aria-invalid={Boolean(state.fieldErrors?.password)}
            aria-describedby={state.fieldErrors?.password ? 'password-error' : 'password-hint'}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-control text-muted transition-colors duration-150 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
          </button>
        </div>
        <p id="password-hint" className="mt-1.5 text-sm text-muted">
          Pelo menos 8 caracteres, com uma letra e um número.
        </p>
        <FieldError field="password" state={state} />
      </div>

      <div>
        <Label htmlFor="confirmPassword">Repita a senha</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          className="mt-2"
          autoComplete="new-password"
          maxLength={72}
          aria-invalid={Boolean(state.fieldErrors?.confirmPassword)}
          aria-describedby={state.fieldErrors?.confirmPassword ? 'confirmPassword-error' : undefined}
          required
        />
        <FieldError field="confirmPassword" state={state} />
      </div>

      <SubmitButton />

      <p className="text-center text-xs leading-relaxed text-muted">
        Seus textos continuam seus. O cadastro cria somente sua conta e seu perfil de autor.
      </p>
    </form>
  );
}
