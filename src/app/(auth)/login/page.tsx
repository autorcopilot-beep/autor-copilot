import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AuthBrand } from '@/features/auth/components/auth-brand';
import { LoginForm } from '@/features/auth/components/login-form';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Entrar' };

const statusMessages: Record<string, string> = {
  'password-updated': 'Senha atualizada. Entre novamente para continuar.',
  'signed-out': 'Sua sessão foi encerrada com segurança.',
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; status?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims?.sub) redirect('/dashboard');

  return (
    <main className="relative flex h-dvh items-center justify-center overflow-hidden px-4 pb-4 pt-20 sm:px-6">
      <header className="absolute inset-x-4 top-4 mx-auto flex max-w-6xl items-center justify-between sm:inset-x-6 sm:top-6"><AuthBrand /><p className="hidden text-sm text-muted sm:block">Acesso seguro · Sua biblioteca</p></header>
      <section className="auth-enter w-full max-w-lg rounded-card border border-line bg-surface px-5 py-6 shadow-soft sm:px-10 sm:py-8" aria-labelledby="login-title">
          <div className="mx-auto max-w-sm">
            <p className="text-meta text-accent">Volte ao manuscrito</p>
            <h1 id="login-title" className="mt-3 font-serif text-4xl font-semibold leading-tight text-ink">Retome sua história</h1>
            <p className="mt-3 leading-relaxed text-muted">Entre com o e-mail usado para abrir seu espaço de escrita.</p>
            {params.status && statusMessages[params.status] && <div className="mt-6 rounded-control border border-success bg-success-subtle px-4 py-3 text-sm text-ink" role="status">{statusMessages[params.status]}</div>}
            <LoginForm next={params.next} />
            <p className="mt-6 text-center text-sm text-muted">Ainda não tem conta? <Link href="/register" className="font-medium text-accent hover:underline">Abra seu espaço</Link></p>
          </div>
      </section>
    </main>
  );
}
