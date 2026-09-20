import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

type LabelProps = ComponentProps<'label'>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn('text-sm font-medium leading-5 text-ink', className)}
      {...props}
    />
  );
}
