import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { KeyRound } from 'lucide-react';

import { AuthBrand } from '@/features/auth/components/auth-brand';
import { UpdatePasswordForm } from '@/features/auth/components/update-password-form';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Nova senha' };

export default async function UpdatePasswordPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) redirect('/forgot-password?error=link-expired');

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 sm:py-6">
      <header className="mx-auto max-w-5xl"><AuthBrand /></header>
      <section className="auth-enter mx-auto mt-10 w-full max-w-lg rounded-card border border-line bg-surface p-7 shadow-soft sm:mt-16 sm:p-10" aria-labelledby="update-title">
        <span className="flex size-11 items-center justify-center rounded-full bg-accent-subtle text-accent"><KeyRound className="size-5" aria-hidden="true" /></span>
        <p className="mt-6 text-meta text-accent">Novo acesso</p>
        <h1 id="update-title" className="mt-3 font-serif text-3xl font-semibold text-ink">Escolha uma nova senha</h1>
        <p className="mt-3 leading-relaxed text-muted">Depois de salvar, suas sessões anteriores serão encerradas e você entrará novamente.</p>
        <UpdatePasswordForm />
        <p className="mt-6 text-center text-xs leading-relaxed text-muted">Não solicitou esta alteração? <Link href="/" className="font-medium text-ink hover:underline">Volte ao início</Link>.</p>
      </section>
    </main>
  );
}
