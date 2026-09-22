'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { LogOut, Menu, PenLine, UserRound, X } from 'lucide-react';

import { Button } from '@/components/ui';
import { logout } from '@/features/auth/actions/logout';

type AccountPanelProps = {
  displayName: string;
  email?: string;
  penName?: string;
  writingFocus?: string;
  mobile?: boolean;
};

function AccountContent({ displayName, email, penName, writingFocus }: Omit<AccountPanelProps, 'mobile'>) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-subtle font-serif text-lg font-semibold text-accent" aria-hidden="true">
          {displayName.slice(0, 1).toLocaleUpperCase('pt-BR')}
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{displayName}</p>
          {email && <p className="truncate text-sm text-muted">{email}</p>}
        </div>
      </div>

      <dl className="mt-8 space-y-5 border-y border-line py-6">
        <div className="flex gap-3">
          <PenLine className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          <div><dt className="text-meta text-muted">Assinatura</dt><dd className="mt-1 text-sm text-ink">{penName || 'Seu nome de perfil'}</dd></div>
        </div>
        <div className="flex gap-3">
          <UserRound className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          <div><dt className="text-meta text-muted">Primeiro formato</dt><dd className="mt-1 text-sm text-ink">{writingFocus || 'Ainda não definido'}</dd></div>
        </div>
      </dl>

      <form action={logout} className="mt-auto pt-6">
        <Button type="submit" variant="secondary" className="w-full"><LogOut className="size-4" aria-hidden="true" />Encerrar sessão</Button>
      </form>
    </div>
  );
}

export function AccountPanel({ mobile = false, ...props }: AccountPanelProps) {
  if (!mobile) return <AccountContent {...props} />;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild><Button variant="secondary" size="icon" aria-label="Abrir conta"><Menu className="size-5" aria-hidden="true" /></Button></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/35 data-[state=closed]:animate-[auth-fade-out_150ms_ease-in] data-[state=open]:animate-[auth-fade-in_150ms_ease-out]" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-[min(22rem,calc(100vw-2rem))] border-l border-line bg-surface p-6 shadow-floating data-[state=closed]:animate-[panel-right-out_150ms_ease-in] data-[state=open]:animate-[panel-right-in_180ms_ease-out]">
          <Dialog.Title className="font-serif text-2xl font-semibold text-ink">Sua conta</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted">Perfil e sessão do Autor Copilot.</Dialog.Description>
          <Dialog.Close className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full text-muted hover:bg-surface-muted" aria-label="Fechar"><X className="size-5" aria-hidden="true" /></Dialog.Close>
          <div className="mt-8 h-[calc(100%-5rem)]"><AccountContent {...props} /></div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
