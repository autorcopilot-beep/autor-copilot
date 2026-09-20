'use client';

import { Check } from 'lucide-react';
import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';

import { cn } from '@/lib/cn';

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root className={cn('peer flex size-5 shrink-0 items-center justify-center rounded-[5px] border border-line-strong bg-surface text-on-accent shadow-sm outline-none transition-colors hover:border-accent focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface data-[state=checked]:border-accent data-[state=checked]:bg-accent disabled:cursor-not-allowed disabled:opacity-50', className)} {...props}>
      <CheckboxPrimitive.Indicator><Check className="size-3.5" strokeWidth={3} /></CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
