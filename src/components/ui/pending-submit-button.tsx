'use client';

import { LoaderCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { cn } from '@/lib/cn';

export function PendingSubmitButton({ children, pendingLabel = 'Processando…', className, disabled, ...props }: React.ComponentProps<'button'> & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return <button {...props} type="submit" disabled={disabled || pending} aria-busy={pending} className={cn('relative inline-flex items-center justify-center gap-2 overflow-hidden disabled:cursor-wait disabled:opacity-70', className)}>
    {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
    {pending ? pendingLabel : children}
    {pending && <span className="absolute inset-x-0 bottom-0 h-0.5 animate-pulse bg-current/30" aria-hidden="true" />}
  </button>;
}
