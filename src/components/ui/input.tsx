import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

type InputProps = ComponentProps<'input'>;

export function Input({ className, type = 'text', ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'min-h-11 w-full rounded-control border border-line-strong bg-surface px-3.5 py-2 text-base text-ink shadow-sm transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-muted hover:border-accent focus-visible:border-focus focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus aria-[invalid=true]:border-danger aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-danger aria-[invalid=true]:hover:border-danger disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-muted disabled:opacity-60 sm:text-sm',
        className,
      )}
      {...props}
    />
  );
}
