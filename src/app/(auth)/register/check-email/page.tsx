import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, MailCheck } from 'lucide-react';

import { buttonVariants } from '@/components/ui';
import { cn } from '@/lib/cn';

export const metadata: Metadata = { title: 'Confirme seu e-mail' };

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="auth-enter w-full max-w-lg rounded-card border border-line bg-surface p-7 text-center shadow-soft sm:p-10" aria-labelledby="check-email-title">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent-subtle text-accent">
          <MailCheck className="size-6" aria-hidden="true" />
        </span>
        <p className="mt-6 text-meta text-accent">Conta criada · falta um passo</p>
        <h1 id="check-email-title" className="mt-3 font-serif text-3xl font-semibold text-ink">
          Confirme seu e-mail
        </h1>
        <p className="mt-4 leading-relaxed text-muted">
          Enviamos um link de confirmação{email ? <> para <strong className="font-medium text-ink">{email}</strong></> : ''}. Depois do clique, você seguirá para preparar seu espaço de escrita.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          O link pode levar alguns minutos. Confira também a pasta de spam e não compartilhe essa mensagem.
        </p>
        <Link href="/register" className={cn(buttonVariants({ variant: 'secondary' }), 'mt-8')}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Corrigir e-mail
        </Link>
      </section>
    </main>
  );
}
