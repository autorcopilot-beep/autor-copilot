import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

type InputProps = ComponentProps<'input'>;

export function Input({ className, type = 'text', ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'min-h-11 w-full rounded-control border border-line-strong bg-surface px-3.5 py-2 text-base text-ink shadow-sm transition-colors duration-150 placeholder:text-muted hover:border-accent focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60 sm:text-sm',
        className,
      )}
      {...props}
    />
  );
}
