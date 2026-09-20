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
    <main className="flex min-h-dvh items-center justify-center bg-[#0b1013] px-4 py-8 text-white">
      <section className="w-full max-w-md rounded-card border border-white/15 bg-[#121a1f] p-7 shadow-2xl" aria-labelledby="admin-login-title">
        <div className="flex size-11 items-center justify-center rounded-control border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"><ShieldCheck aria-hidden="true" /></div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">The Vault</p>
        <h1 id="admin-login-title" className="mt-2 text-3xl font-semibold">Autor Copilot Admin</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">Área restrita. Não existe criação pública de contas administrativas.</p>
        {params.error && messages[params.error] && <div className="mt-5 rounded-control border border-red-400/35 bg-red-400/10 px-4 py-3 text-sm text-red-100" role="alert">{messages[params.error]}</div>}
        {params.status === 'signed-out' && <div className="mt-5 rounded-control border border-emerald-400/35 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100" role="status">Sessão administrativa encerrada.</div>}
        <AdminLoginForm />
      </section>
    </main>
  );
}
