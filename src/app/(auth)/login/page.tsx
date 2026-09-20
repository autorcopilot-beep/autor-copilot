import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AuthBrand } from '@/features/auth/components/auth-brand';
import { LoginContext } from '@/features/auth/components/login-context';
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
    <main className="min-h-screen px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <header className="mx-auto flex max-w-6xl items-center justify-between"><AuthBrand /><p className="hidden text-sm text-muted sm:block">Acesso seguro · Sua biblioteca</p></header>
      <div className="mx-auto grid max-w-6xl gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.72fr)] lg:items-stretch lg:py-12">
        <section className="auth-enter rounded-card border border-line bg-surface px-5 py-8 shadow-soft sm:px-10 sm:py-10 lg:px-14" aria-labelledby="login-title">
          <div className="mx-auto max-w-md">
            <p className="text-meta text-accent">Volte ao manuscrito</p>
            <h1 id="login-title" className="mt-3 font-serif text-4xl font-semibold leading-tight text-ink">Retome sua história</h1>
            <p className="mt-3 leading-relaxed text-muted">Entre com o e-mail usado para abrir seu espaço de escrita.</p>
            {params.status && statusMessages[params.status] && <div className="mt-6 rounded-control border border-success bg-success-subtle px-4 py-3 text-sm text-ink" role="status">{statusMessages[params.status]}</div>}
            <div className="mt-6 lg:hidden"><LoginContext mobile /></div>
            <LoginForm next={params.next} />
            <p className="mt-6 text-center text-sm text-muted">Ainda não tem conta? <Link href="/register" className="font-medium text-accent hover:underline">Abra seu espaço</Link></p>
          </div>
        </section>
        <aside className="auth-enter-delayed hidden rounded-card border border-line bg-editor p-10 lg:block" aria-label="Sobre sua sessão"><LoginContext /></aside>
      </div>
    </main>
  );
}
