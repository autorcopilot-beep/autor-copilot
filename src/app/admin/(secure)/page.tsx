import { Activity, KeyRound, Shield, Users } from 'lucide-react';

import { requireAdmin } from '@/features/admin/auth';
import { adminRoleLabels } from '@/features/admin/rbac';

export default async function AdminHomePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const admin = await requireAdmin();
  const { error } = await searchParams;
  return (
    <div>
      {error === 'forbidden' && <div className="mb-6 rounded-control border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100" role="alert">Seu papel não possui permissão para executar essa ação.</div>}
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">The Vault · Step 1</p>
      <h1 className="mt-2 text-3xl font-semibold">Fundação administrativa</h1>
      <p className="mt-3 max-w-2xl text-white/55">Sessão validada para {adminRoleLabels[admin.role]}. Os módulos abaixo já respeitam RBAC e trilha de auditoria.</p>
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Estado da fundação">
        {[
          [Shield, 'Identidade', 'Acesso administrativo isolado'],
          [KeyRound, 'RBAC', 'Permissões por papel'],
          [Users, 'Administradores', 'Criação exclusiva do Master'],
          [Activity, 'Auditoria', 'Eventos append-only'],
        ].map(([Icon, title, copy]) => {
          const ItemIcon = Icon as typeof Shield;
          return <article key={String(title)} className="rounded-card border border-white/10 bg-white/[0.035] p-5"><ItemIcon className="size-5 text-emerald-300" aria-hidden="true" /><h2 className="mt-5 font-medium">{String(title)}</h2><p className="mt-1 text-sm text-white/45">{String(copy)}</p></article>;
        })}
      </section>
    </div>
  );
}
