'use client';

import { ArrowUpRight, FileText, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  buttonVariants,
} from '@/components/ui';
import { cn } from '@/lib/cn';

type LegalDocumentKey = 'terms' | 'privacy';

const legalDocuments = {
  terms: {
    title: 'Termos de Uso',
    description: 'As regras para criar e usar sua conta no Autor Copilot.',
    href: '/legal/termos-de-uso',
    icon: FileText,
    highlights: [
      'Sua obra, seus personagens e seu universo continuam pertencendo a você.',
      'A licença concedida à plataforma se limita a armazenar, sincronizar e exportar o conteúdo.',
      'Você pode exportar seus textos e encerrar sua conta conforme as regras de retenção.',
    ],
  },
  privacy: {
    title: 'Política de Dados e Privacidade',
    description: 'Como seus dados pessoais e o conteúdo da sua obra são tratados.',
    href: '/legal/privacidade',
    icon: ShieldCheck,
    highlights: [
      'Coletamos apenas os dados necessários para operar e proteger sua conta.',
      'O envio de conteúdo a provedores externos de IA depende do recurso acionado e, quando exigido, de consentimento específico.',
      'Você pode solicitar acesso, correção, portabilidade ou exclusão dos seus dados.',
    ],
  },
} as const;

export function LegalConsentDrawer({ document }: { document: LegalDocumentKey }) {
  const current = legalDocuments[document];
  const relatedKey: LegalDocumentKey = document === 'terms' ? 'privacy' : 'terms';
  const related = legalDocuments[relatedKey];

  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger
        render={(
          <button
            type="button"
            className="font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:text-accent-hover focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          />
        )}
      >
        {current.title}
      </DrawerTrigger>
      <LegalDrawerContent document={current}>
        <Drawer showSwipeHandle>
          <DrawerTrigger
            render={(
              <button
                type="button"
                className="mt-5 flex w-full items-center gap-3 rounded-control border border-line bg-surface-muted px-3 py-3 text-left transition-colors hover:border-accent"
              />
            )}
          >
            <related.icon className="size-4 shrink-0 text-accent" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-muted">Consulte também</span>
              <span className="block font-medium text-ink">{related.title}</span>
            </span>
            <ArrowUpRight className="size-4 shrink-0 text-muted" aria-hidden="true" />
          </DrawerTrigger>
          <LegalDrawerContent document={related} nested />
        </Drawer>
      </LegalDrawerContent>
    </Drawer>
  );
}

function LegalDrawerContent({
  document,
  children,
  nested = false,
}: {
  document: (typeof legalDocuments)[LegalDocumentKey];
  children?: React.ReactNode;
  nested?: boolean;
}) {
  const Icon = document.icon;

  return (
    <DrawerContent className="max-h-[calc(100dvh-2rem)] border-line bg-surface text-ink shadow-2xl">
      <DrawerHeader className="mx-auto w-full max-w-2xl px-5 pt-6 text-left sm:px-8">
        <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-accent-subtle text-accent">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <DrawerTitle className="font-serif text-xl font-semibold text-ink sm:text-2xl">
          {document.title}
        </DrawerTitle>
        <DrawerDescription className="text-sm leading-relaxed text-muted">
          {document.description}
        </DrawerDescription>
      </DrawerHeader>

      <div className="workspace-scrollbar mx-auto min-h-0 w-full max-w-2xl flex-1 overflow-y-auto px-5 py-5 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Resumo antes do aceite</p>
        <ul className="mt-3 space-y-3">
          {document.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3 text-sm leading-relaxed text-ink">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
        {children}
      </div>

      <DrawerFooter className="mx-auto w-full max-w-2xl gap-2 border-t border-line px-5 pb-5 pt-4 sm:flex-row sm:px-8">
        <Link href={document.href} className={cn(buttonVariants({ size: 'wide' }), 'w-full sm:flex-1')}>
          Ler documento completo
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
        <DrawerClose render={<Button variant="secondary" className="w-full sm:w-auto" />}>
          {nested ? 'Voltar' : 'Fechar'}
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  );
}
