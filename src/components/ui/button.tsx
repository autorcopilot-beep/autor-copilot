import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

export const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-control border px-4 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'border-accent bg-accent text-on-accent hover:border-accent-hover hover:bg-accent-hover active:border-accent-active active:bg-accent-active',
        secondary:
          'border-line-strong bg-surface text-ink hover:border-accent hover:bg-surface-muted active:bg-accent-subtle',
        ghost:
          'border-transparent bg-transparent text-ink hover:border-line hover:bg-surface-muted active:bg-accent-subtle',
        danger:
          'border-danger bg-danger text-on-danger hover:border-danger-hover hover:bg-danger-hover',
      },
      size: {
        default: 'px-4',
        wide: 'px-6',
        icon: 'size-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
