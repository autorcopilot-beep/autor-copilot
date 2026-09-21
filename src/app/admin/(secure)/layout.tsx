import { LogOut, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui';
import { adminLogout } from '@/features/admin/actions/logout';
import { requireAdmin } from '@/features/admin/auth';
import { AdminCommandPalette, type AdminCommand } from '@/features/admin/components/admin-command-palette';
import { adminRoleLabels, hasAdminPermission } from '@/features/admin/rbac';

export default async function AdminSecureLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const environment = process.env.VERCEL_ENV ?? (process.env.NODE_ENV === 'production' ? 'production' : 'local');
  const environmentStyle = environment === 'production' ? 'border-red-500 bg-red-950 text-red-100' : environment === 'preview' ? 'border-blue-500 bg-blue-950 text-blue-100' : 'border-emerald-500 bg-emerald-950 text-emerald-100';
  const commands: AdminCommand[] = [
    { href: '/admin', label: 'Visão geral', keywords: 'dashboard início métricas', icon: 'dashboard' },
    ...(hasAdminPermission(admin.role, 'admins.read') ? [{ href: '/admin/admins', label: 'Administradores', keywords: 'identidade acesso rbac equipe', icon: 'admins' as const }] : []),
    ...(hasAdminPermission(admin.role, 'admins.manage') ? [{ href: '/admin/admins/new', label: 'Criar administrador', keywords: 'novo convite conta papel', icon: 'new-admin' as const }] : []),
    ...(hasAdminPermission(admin.role, 'users.read') ? [{ href: '/admin/users', label: 'Usuários', keywords: 'clientes grupos tags suspensão', icon: 'users' as const }] : []),
    ...(hasAdminPermission(admin.role, 'features.read') ? [{ href: '/admin/extensions', label: 'Extensões', keywords: 'marketplace preço grupos catálogo', icon: 'extensions' as const }, { href: '/admin/flags', label: 'Flags e tags', keywords: 'rollout feature liberação segmentos', icon: 'flags' as const }] : []),
    ...(hasAdminPermission(admin.role, 'legal.read') ? [{ href: '/admin/legal', label: 'Termos legais', keywords: 'jurídico documentos versões publicação', icon: 'legal' as const }] : []),
    ...(hasAdminPermission(admin.role, 'audit.read') ? [{ href: '/admin/audit', label: 'Trilha de auditoria', keywords: 'logs eventos segurança', icon: 'audit' as const }] : []),
  ];

  return (
    <div className="min-h-dvh bg-[#0b1013] text-white">
      <div className={`border-b px-4 py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] ${environmentStyle}`}>Ambiente: {environment}</div>
      <header className="border-b border-white/10 bg-[#10171b] px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Link href="/admin" className="flex shrink-0 items-center gap-3">
            <ShieldCheck className="size-5 text-emerald-300" aria-hidden="true" />
            <div className="hidden sm:block"><p className="font-semibold">God Mode</p><p className="text-xs text-white/50">Autor Copilot Admin Center</p></div>
          </Link>
          <div className="mx-auto flex w-full max-w-xs justify-end md:justify-center"><AdminCommandPalette commands={commands} /></div>
          <nav className="hidden shrink-0 items-center gap-5 text-sm text-white/65 xl:flex" aria-label="Administração">
            <Link href="/admin" className="hover:text-white">Visão geral</Link>
            {hasAdminPermission(admin.role, 'admins.read') && <Link href="/admin/admins" className="hover:text-white">Administradores</Link>}
            {hasAdminPermission(admin.role, 'users.read') && <Link href="/admin/users" className="hover:text-white">Usuários</Link>}
            {hasAdminPermission(admin.role, 'features.read') && <Link href="/admin/extensions" className="hover:text-white">Extensões</Link>}
            {hasAdminPermission(admin.role, 'features.read') && <Link href="/admin/flags" className="hover:text-white">Flags</Link>}
            {hasAdminPermission(admin.role, 'legal.read') && <Link href="/admin/legal" className="hover:text-white">Legal</Link>}
            {hasAdminPermission(admin.role, 'audit.read') && <Link href="/admin/audit" className="hover:text-white">Auditoria</Link>}
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden text-right lg:block"><p className="text-sm font-medium">{admin.displayName}</p><p className="text-xs text-white/45">{adminRoleLabels[admin.role]}</p></div>
            <form action={adminLogout}><Button type="submit" variant="ghost" size="icon" className="border-white/10 text-white hover:bg-white/10" aria-label="Sair do Admin Center"><LogOut className="size-4" /></Button></form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
