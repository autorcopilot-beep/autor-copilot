import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpenText } from 'lucide-react';

import { RegisterContext } from '@/features/auth/components/register-context';
import { RegisterForm } from '@/features/auth/components/register-form';
import { brandImage } from '@/lib/brand-image';

export const metadata: Metadata = {
  title: 'Criar conta',
  description: 'Crie seu espaço de escrita no Autor Copilot.',
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <header className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="inline-flex min-h-11 items-center gap-3 rounded-control px-2 text-sm font-semibold tracking-wide text-ink">
          {brandImage ? (
            <Image src={brandImage} alt="" width={30} height={30} className="size-[30px] object-contain" priority />
          ) : (
            <BookOpenText className="size-7 text-accent" aria-hidden="true" />
          )}
          AUTOR COPILOT
        </Link>
        <p className="hidden text-sm text-muted sm:block">Etapa 1 de 2 · Sua conta</p>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.72fr)] lg:items-stretch lg:py-12">
        <section className="auth-enter rounded-card border border-line bg-surface px-5 py-8 shadow-soft sm:px-10 sm:py-10 lg:px-14" aria-labelledby="register-title">
          <div className="mx-auto max-w-md">
            <p className="text-meta text-accent">Sua próxima história começa aqui</p>
            <h1 id="register-title" className="mt-3 font-serif text-4xl font-semibold leading-tight text-ink">
              Abra seu espaço de escrita
            </h1>
            <p className="mt-3 leading-relaxed text-muted">
              Primeiro, precisamos apenas do essencial. Os detalhes da sua escrita vêm depois.
            </p>

            <div className="mt-6 lg:hidden">
              <RegisterContext mobile />
            </div>

            <RegisterForm confirmationError={error === 'confirmation'} />

            <p className="mt-6 text-center text-sm text-muted">
              Já tem uma conta?{' '}
              <Link href="/login" className="font-medium text-accent hover:underline">Entre no seu espaço.</Link>
            </p>
          </div>
        </section>

        <aside className="auth-enter-delayed hidden rounded-card border border-line bg-editor p-10 lg:block" aria-label="Sobre seu espaço de escrita">
          <RegisterContext />
        </aside>
      </div>
    </main>
  );
}
