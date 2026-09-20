'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { BookMarked, LockKeyhole, PanelRightClose, X } from 'lucide-react';

import { Button } from '@/components/ui';

const notes = [
  {
    icon: BookMarked,
    title: 'Comece pela obra',
    description: 'Depois da confirmação, você define o tipo de história e abre seu primeiro projeto.',
  },
  {
    icon: LockKeyhole,
    title: 'Seu texto é seu',
    description: 'Nenhum conteúdo criativo é usado para treinar modelos por padrão.',
  },
];

export function RegisterContext({ mobile = false }: { mobile?: boolean }) {
  const content = (
    <div className="space-y-8">
      <div>
        <p className="text-meta text-muted">Folha de abertura · 01</p>
        <h2 className="mt-4 max-w-sm font-serif text-3xl font-semibold leading-tight text-ink">
          Um lugar para a história inteira fazer sentido.
        </h2>
        <p className="mt-4 max-w-sm leading-relaxed text-muted">
          Escreva sem perder de vista personagens, acontecimentos e tudo o que cada pessoa sabe.
        </p>
      </div>

      <div className="space-y-5">
        {notes.map(({ icon: Icon, title, description }, index) => (
          <div key={title} className="flex gap-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-accent">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="font-medium text-ink">{title}</p>
              <p className="mt-1 max-w-xs text-sm leading-relaxed text-muted">{description}</p>
              {index === 0 && <span className="sr-only">Primeira etapa</span>}
            </div>
          </div>
        ))}
      </div>

      <blockquote className="border-l-2 border-accent pl-4 font-serif text-base italic leading-relaxed text-ink">
        “As ferramentas ficam por perto. A escrita permanece no centro.”
      </blockquote>
    </div>
  );

  if (!mobile) return content;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="secondary" className="w-full sm:w-auto">
          <PanelRightClose className="size-4" aria-hidden="true" />
          O que acontece depois?
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/35 data-[state=closed]:animate-[auth-fade-out_150ms_ease-in] data-[state=open]:animate-[auth-fade-in_150ms_ease-out]" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-[1.25rem] border border-line bg-canvas p-6 pb-8 shadow-floating data-[state=closed]:animate-[drawer-down_150ms_ease-in] data-[state=open]:animate-[drawer-up_180ms_ease-out]">
          <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-line-strong" aria-hidden="true" />
          <Dialog.Title className="sr-only">O que acontece depois do cadastro</Dialog.Title>
          <Dialog.Description className="sr-only">
            Conheça os próximos passos e como seus dados criativos são tratados.
          </Dialog.Description>
          {content}
          <Dialog.Close asChild>
            <button className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full text-muted hover:bg-surface" aria-label="Fechar">
              <X className="size-5" aria-hidden="true" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
