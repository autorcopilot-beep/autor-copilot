'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Bookmark, Clock3, PanelRightClose, ShieldCheck, X } from 'lucide-react';

import { Button } from '@/components/ui';

const chapters = [
  { icon: Bookmark, title: 'Seu contexto permanece', copy: 'Personagens, cenas e decisões voltam ao lugar onde você parou.' },
  { icon: ShieldCheck, title: 'Sessão verificada', copy: 'O acesso é confirmado no servidor antes de abrir seu espaço.' },
];

function ContextContent() {
  return (
    <div>
      <p className="text-meta text-muted">Marcador de página</p>
      <h2 className="mt-4 max-w-sm font-serif text-3xl font-semibold leading-tight text-ink">A história estava esperando por você.</h2>
      <p className="mt-4 max-w-sm leading-relaxed text-muted">Entre para retomar o fio da narrativa sem reconstruir o contexto a cada sessão.</p>

      <div className="mt-9 space-y-6">
        {chapters.map(({ icon: Icon, title, copy }) => (
          <div key={title} className="flex gap-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-accent"><Icon className="size-4" aria-hidden="true" /></span>
            <div><p className="font-medium text-ink">{title}</p><p className="mt-1 max-w-xs text-sm leading-relaxed text-muted">{copy}</p></div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center gap-3 border-t border-line pt-6 text-sm text-muted">
        <Clock3 className="size-4 text-accent" aria-hidden="true" />
        Escrever também é saber onde continuar.
      </div>
    </div>
  );
}

export function LoginContext({ mobile = false }: { mobile?: boolean }) {
  if (!mobile) return <ContextContent />;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="secondary" className="w-full"><PanelRightClose className="size-4" aria-hidden="true" />Como protegemos sua retomada?</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/35 data-[state=closed]:animate-[auth-fade-out_150ms_ease-in] data-[state=open]:animate-[auth-fade-in_150ms_ease-out]" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-[1.25rem] border border-line bg-canvas p-6 pb-8 shadow-floating data-[state=closed]:animate-[drawer-down_150ms_ease-in] data-[state=open]:animate-[drawer-up_180ms_ease-out]">
          <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-line-strong" aria-hidden="true" />
          <Dialog.Title className="sr-only">Como sua sessão é protegida</Dialog.Title>
          <Dialog.Description className="sr-only">Informações sobre continuidade e segurança da sessão.</Dialog.Description>
          <ContextContent />
          <Dialog.Close className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full text-muted hover:bg-surface" aria-label="Fechar"><X className="size-5" aria-hidden="true" /></Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
