'use client';

import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';
import * as React from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/cn';

function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return <CommandPrimitive className={cn('flex size-full flex-col overflow-hidden rounded-card bg-[#11191e] text-white', className)} {...props} />;
}

function CommandDialog({ title = 'Comandos', description = 'Busque uma página ou ação.', children, className, ...props }: React.ComponentProps<typeof Dialog> & { title?: string; description?: string; className?: string }) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only"><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader>
      <DialogContent className={cn('top-[38%] overflow-hidden p-0', className)} showCloseButton={false}>{children}</DialogContent>
    </Dialog>
  );
}

function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="flex items-center gap-3 border-b border-white/10 px-4" cmdk-input-wrapper="">
      <Search className="size-4 shrink-0 text-white/40" aria-hidden="true" />
      <CommandPrimitive.Input className={cn('h-14 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35 disabled:opacity-50', className)} {...props} />
    </div>
  );
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return <CommandPrimitive.List className={cn('max-h-80 overflow-y-auto overflow-x-hidden p-2 outline-none', className)} {...props} />;
}

function CommandEmpty({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return <CommandPrimitive.Empty className={cn('py-10 text-center text-sm text-white/45', className)} {...props} />;
}

function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return <CommandPrimitive.Group className={cn('overflow-hidden p-1 text-white [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-white/35', className)} {...props} />;
}

function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return <CommandPrimitive.Separator className={cn('-mx-1 h-px bg-white/10', className)} {...props} />;
}

function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return <CommandPrimitive.Item className={cn('relative flex cursor-default select-none items-center gap-3 rounded-control px-3 py-2.5 text-sm text-white/70 outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40 data-[selected=true]:bg-emerald-400/10 data-[selected=true]:text-emerald-100 [&_svg]:size-4 [&_svg]:shrink-0', className)} {...props} />;
}

function CommandShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('ml-auto text-xs tracking-widest text-white/35', className)} {...props} />;
}

export { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut };
