'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Input, Label } from '@/components/ui';

type PasswordFieldProps = {
  id: string;
  label: string;
  autoComplete: 'current-password' | 'new-password';
  error?: string;
  hint?: string;
};

export function PasswordField({ id, label, autoComplete, error, hint }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative mt-2">
        <Input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          className="pr-12"
          autoComplete={autoComplete}
          minLength={autoComplete === 'new-password' ? 8 : undefined}
          maxLength={72}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          required
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-control text-muted transition-colors duration-150 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={visible}
        >
          {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
        </button>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
