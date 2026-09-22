'use client';

import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import * as React from 'react';
import { Select as SelectPrimitive } from 'radix-ui';

import { cn } from '@/lib/cn';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger className={cn('flex min-h-11 w-full items-center justify-between gap-3 rounded-control border border-line-strong bg-surface px-3.5 py-2 text-left text-sm text-ink shadow-sm outline-none transition-[border-color,box-shadow] hover:border-accent focus:border-focus focus:ring-1 focus:ring-focus disabled:cursor-not-allowed disabled:opacity-60 [&>span]:min-w-0 [&>span]:truncate', className)} {...props}>
      {children}<SelectPrimitive.Icon asChild><ChevronDown className="size-4 shrink-0 text-muted" /></SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({ className, children, position = 'popper', ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content position={position} className={cn('z-[80] max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-card border border-line bg-surface text-ink shadow-floating data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0', position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1', className)} {...props}>
        <SelectPrimitive.ScrollUpButton className="flex h-7 items-center justify-center"><ChevronUp className="size-4" /></SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="p-1.5">{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex h-7 items-center justify-center"><ChevronDown className="size-4" /></SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return <SelectPrimitive.Label className={cn('px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted', className)} {...props} />;
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item className={cn('relative flex min-h-10 cursor-default select-none items-center rounded-control py-2 pl-9 pr-3 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-40 focus:bg-accent-subtle focus:text-accent-active', className)} {...props}>
      <span className="absolute left-3 flex size-4 items-center justify-center"><SelectPrimitive.ItemIndicator><Check className="size-4" /></SelectPrimitive.ItemIndicator></span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator className={cn('-mx-1 my-1 h-px bg-line', className)} {...props} />;
}

export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue };
