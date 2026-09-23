import { Activity, FileText, Flag, Headphones, Megaphone, PackageCheck, Shield, Users } from 'lucide-react';
import Link from 'next/link';

import { requireAdmin } from '@/features/admin/auth';
import { adminRoleLabels, hasAdminPermission } from '@/features/admin/rbac';

export default async function AdminHomePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const admin = await requireAdmin();
  const { error } = await searchParams;
  const modules = [
    { href: '/admin/publish', permission: 'communications.read' as const, icon: Megaphone, title: 'OmniPublish', copy: 'Campanhas multicanal, revisão e entregas rastreáveis.' },
    { href: '/admin/users', permission: 'users.read' as const, icon: Users, title: 'Usuários', copy: 'Status, grupos de acesso e tags operacionais.' },
    { href: '/admin/extensions', permission: 'features.read' as const, icon: PackageCheck, title: 'Extensões', copy: 'Catálogo, publicação, preço e elegibilidade.' },
    { href: '/admin/sound', permission: 'features.read' as const, icon: Headphones, title: 'Media & Sound', copy: 'Faixas, capas, licenças e provas de audiolivro.' },
    { href: '/admin/flags', permission: 'features.read' as const, icon: Flag, title: 'Flags e tags', copy: 'Rollout e liberação por segmento.' },
    { href: '/admin/legal', permission: 'legal.read' as const, icon: FileText, title: 'Termos legais', copy: 'Conteúdo, versões, vigência e publicação.' },
    { href: '/admin/admins', permission: 'admins.read' as const, icon: Shield, title: 'Administradores', copy: 'Identidades administrativas e RBAC.' },
    { href: '/admin/audit', permission: 'audit.read' as const, icon: Activity, title: 'Auditoria', copy: 'Histórico imutável das alterações.' },
  ].filter((module) => hasAdminPermission(admin.role, module.permission));
  return <div>
    {error === 'forbidden' && <div className="mb-6 rounded-control border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-danger" role="alert">Seu papel não possui permissão para executar essa ação.</div>}
    <section className="overflow-hidden rounded-[1.75rem] border border-line bg-surface p-6 shadow-soft sm:p-9"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Operação do produto</p><h1 className="mt-3 max-w-3xl font-serif text-3xl font-semibold sm:text-4xl">Centro de controle do Autor Copilot</h1><p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">Sessão validada para {adminRoleLabels[admin.role]}. Mudanças sensíveis respeitam as permissões da equipe e entram automaticamente na trilha de auditoria.</p><div className="mt-7 flex flex-wrap gap-2"><span className="rounded-full bg-success-subtle px-3 py-1.5 text-xs font-medium text-success">Sessão protegida</span><span className="rounded-full bg-accent-subtle px-3 py-1.5 text-xs font-medium text-accent">{modules.length} módulos disponíveis</span></div></section>
    <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Módulos administrativos">{modules.map(({ href, icon: Icon, title, copy }) => <Link key={href} href={href} className="group rounded-2xl border border-line bg-surface p-5 shadow-soft transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-floating"><span className="flex size-10 items-center justify-center rounded-xl bg-accent-subtle text-accent"><Icon className="size-5" /></span><h2 className="mt-5 font-serif text-lg font-semibold group-hover:text-accent">{title}</h2><p className="mt-1 text-sm leading-relaxed text-muted">{copy}</p></Link>)}</section>
  </div>;
}
