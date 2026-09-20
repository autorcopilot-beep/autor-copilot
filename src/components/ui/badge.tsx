import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

type BadgeProps = ComponentProps<'span'>;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex min-h-6 items-center rounded-full bg-accent-subtle px-2.5 py-1 text-meta font-medium text-accent',
        className,
      )}
      {...props}
    />
  );
}
