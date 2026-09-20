'use client';

import * as React from 'react';
import { Avatar as AvatarPrimitive } from 'radix-ui';

import { cn } from '@/lib/cn';

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return <AvatarPrimitive.Root data-slot="avatar" className={cn('relative flex size-10 shrink-0 overflow-visible rounded-full', className)} {...props} />;
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image className={cn('aspect-square size-full rounded-full object-cover', className)} {...props} />;
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return <AvatarPrimitive.Fallback className={cn('flex size-full items-center justify-center rounded-full bg-accent-subtle font-serif font-semibold text-accent', className)} {...props} />;
}

function AvatarBadge({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('absolute bottom-0 right-0 z-10 flex size-3 items-center justify-center rounded-full border-2 border-surface', className)} {...props} />;
}

function AvatarStatus({ online = false }: { online?: boolean }) {
  return <AvatarBadge className={online ? 'bg-success' : 'bg-danger'} aria-label={online ? 'Online' : 'Offline'} />;
}

function AvatarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex -space-x-2 [&_[data-slot=avatar]]:ring-2 [&_[data-slot=avatar]]:ring-surface', className)} {...props} />;
}

function AvatarGroupCount({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('relative flex size-8 items-center justify-center rounded-full border-2 border-surface bg-surface-muted text-[10px] font-semibold text-muted', className)} {...props} />;
}

export { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage, AvatarStatus };
