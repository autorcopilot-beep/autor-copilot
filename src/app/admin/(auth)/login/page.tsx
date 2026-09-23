import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

import { AdminLoginForm } from '@/features/admin/components/admin-login-form';
import { getAdminContext } from '@/features/admin/auth';

export const metadata: Metadata = { title: 'Admin Center' };

const messages: Record<string, string> = {
  unauthorized: 'A sessão não possui autorização administrativa.',
  'invite-expired': 'O convite expirou ou já foi utilizado. Solicite um novo convite ao Master Admin.',
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string; status?: string }> }) {
  const params = await searchParams;
  const admin = await getAdminContext();
  if (admin) redirect('/admin');

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-canvas px-4 py-8 text-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,color-mix(in_srgb,var(--color-accent)_12%,transparent),transparent_34%),radial-gradient(circle_at_85%_85%,color-mix(in_srgb,var(--color-accent)_8%,transparent),transparent_32%)]" aria-hidden="true" />
      <section className="relative w-full max-w-md rounded-[1.5rem] border border-line bg-surface p-7 shadow-floating sm:p-9" aria-labelledby="admin-login-title">
        <div className="flex size-12 items-center justify-center rounded-xl bg-accent text-on-accent shadow-soft"><ShieldCheck aria-hidden="true" /></div>
        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.22em] text-accent">Área administrativa</p>
        <h1 id="admin-login-title" className="mt-2 font-serif text-3xl font-semibold">Autor Copilot Admin</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">Área restrita. Não existe criação pública de contas administrativas.</p>
        {params.error && messages[params.error] && <div className="mt-5 rounded-control border border-red-400/35 bg-red-400/10 px-4 py-3 text-sm text-danger" role="alert">{messages[params.error]}</div>}
        {params.status === 'signed-out' && <div className="mt-5 rounded-control border border-accent/30 bg-accent-subtle px-4 py-3 text-sm text-accent" role="status">Sessão administrativa encerrada.</div>}
        <AdminLoginForm />
      </section>
    </main>
  );
}
