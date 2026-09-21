import { Activity, FileText, Flag, PackageCheck, Shield, Users } from 'lucide-react';
import Link from 'next/link';

import { requireAdmin } from '@/features/admin/auth';
import { adminRoleLabels, hasAdminPermission } from '@/features/admin/rbac';

export default async function AdminHomePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const admin = await requireAdmin();
  const { error } = await searchParams;
  const modules = [
    { href: '/admin/users', permission: 'users.read' as const, icon: Users, title: 'Usuários', copy: 'Status, grupos de acesso e tags operacionais.' },
    { href: '/admin/extensions', permission: 'features.read' as const, icon: PackageCheck, title: 'Extensões', copy: 'Catálogo, publicação, preço e elegibilidade.' },
    { href: '/admin/flags', permission: 'features.read' as const, icon: Flag, title: 'Flags e tags', copy: 'Rollout e liberação por segmento.' },
    { href: '/admin/legal', permission: 'legal.read' as const, icon: FileText, title: 'Termos legais', copy: 'Conteúdo, versões, vigência e publicação.' },
    { href: '/admin/admins', permission: 'admins.read' as const, icon: Shield, title: 'Administradores', copy: 'Identidades administrativas e RBAC.' },
    { href: '/admin/audit', permission: 'audit.read' as const, icon: Activity, title: 'Auditoria', copy: 'Histórico imutável das alterações.' },
  ].filter((module) => hasAdminPermission(admin.role, module.permission));
  return <div>
    {error === 'forbidden' && <div className="mb-6 rounded-control border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100" role="alert">Seu papel não possui permissão para executar essa ação.</div>}
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">The Vault · Product Control</p><h1 className="mt-2 text-3xl font-semibold">Centro de controle</h1><p className="mt-3 max-w-2xl text-white/55">Sessão validada para {adminRoleLabels[admin.role]}. Mudanças sensíveis passam por RBAC e são registradas na trilha de auditoria.</p>
    <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Módulos administrativos">{modules.map(({ href, icon: Icon, title, copy }) => <Link key={href} href={href} className="group rounded-card border border-white/10 bg-white/[0.035] p-5 transition-colors hover:border-emerald-400/35 hover:bg-white/[0.06]"><Icon className="size-5 text-emerald-300" /><h2 className="mt-5 font-medium group-hover:text-emerald-100">{title}</h2><p className="mt-1 text-sm text-white/45">{copy}</p></Link>)}</section>
  </div>;
}
