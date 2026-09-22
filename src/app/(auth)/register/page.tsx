import type { Metadata } from 'next';
import Link from 'next/link';

import { AuthBrand } from '@/features/auth/components/auth-brand';
import { RegisterForm } from '@/features/auth/components/register-form';

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
    <main className="relative flex h-dvh items-center justify-center overflow-hidden px-3 pb-3 pt-[4.75rem] sm:px-6 sm:pb-5 sm:pt-20">
      <header className="absolute inset-x-3 top-3 mx-auto flex max-w-6xl items-center justify-between sm:inset-x-6 sm:top-5">
        <AuthBrand />
        <p className="text-xs text-muted sm:text-sm">Já tem conta? <Link href="/login" className="font-medium text-accent hover:underline">Entrar</Link></p>
      </header>
      <section className="auth-enter flex h-full max-h-[42rem] w-full max-w-5xl flex-col" aria-labelledby="register-title">
        <h1 id="register-title" className="sr-only">Criar conta no Autor Copilot</h1>
        <RegisterForm confirmationError={error === 'confirmation'} />
      </section>
    </main>
  );
}
