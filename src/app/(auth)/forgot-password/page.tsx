import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, KeyRound } from 'lucide-react';

import { buttonVariants } from '@/components/ui';
import { AuthBrand } from '@/features/auth/components/auth-brand';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';
import { cn } from '@/lib/cn';

export const metadata: Metadata = { title: 'Recuperar senha' };

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 sm:py-6">
      <header className="mx-auto max-w-5xl"><AuthBrand /></header>
      <section className="auth-enter mx-auto mt-10 w-full max-w-lg rounded-card border border-line bg-surface p-7 shadow-soft sm:mt-16 sm:p-10" aria-labelledby="forgot-title">
        <span className="flex size-11 items-center justify-center rounded-full bg-accent-subtle text-accent"><KeyRound className="size-5" aria-hidden="true" /></span>
        <p className="mt-6 text-meta text-accent">Recupere o marcador</p>
        <h1 id="forgot-title" className="mt-3 font-serif text-3xl font-semibold text-ink">Crie um novo acesso</h1>
        <p className="mt-3 leading-relaxed text-muted">Informe seu e-mail. Por privacidade, a resposta será a mesma mesmo quando não houver uma conta.</p>
        {error === 'link-expired' && <div className="mt-6 rounded-control border border-warning bg-warning-subtle px-4 py-3 text-sm text-ink" role="alert">O link expirou ou já foi utilizado. Solicite um novo abaixo.</div>}
        <ForgotPasswordForm />
        <Link href="/login" className={cn(buttonVariants({ variant: 'ghost' }), 'mt-6 w-full')}><ArrowLeft className="size-4" aria-hidden="true" />Voltar para o login</Link>
      </section>
    </main>
  );
}
