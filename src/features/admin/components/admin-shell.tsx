'use client';

import {
  Activity, BookOpen, Braces, ChevronLeft, ChevronRight, Compass, FileText, Flag, Headphones,
  LayoutDashboard, LogOut, Megaphone, Menu, PackageCheck, ShieldCheck, Sparkles, Users, X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, Button } from '@/components/ui';
import { adminLogout } from '@/features/admin/actions/logout';
import { AdminCommandPalette, type AdminCommand } from '@/features/admin/components/admin-command-palette';
import { cn } from '@/lib/cn';

export type AdminNavItem = {
  href: string;
  label: string;
  description: string;
  icon: AdminCommand['icon'];
};

const icons = {
  dashboard: LayoutDashboard,
  admins: ShieldCheck,
  'new-admin': ShieldCheck,
  audit: Activity,
  users: Users,
  extensions: PackageCheck,
  sound: Headphones,
  flags: Flag,
  guidance: Compass,
  archetypes: Sparkles,
  legal: FileText,
  publish: Megaphone,
  api: Braces,
};

function isCurrent(pathname: string, href: string) {
  return href === '/admin' ? pathname === href : pathname.startsWith(href);
}

export function AdminShell({
  children,
  displayName,
  roleLabel,
  environment,
  commands,
  navigation,
}: {
  children: React.ReactNode;
  displayName: string;
  roleLabel: string;
  environment: string;
  commands: AdminCommand[];
  navigation: AdminNavItem[];
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const current = navigation.find((item) => isCurrent(pathname, item.href)) ?? navigation[0];

  useEffect(() => {
    if (!mobileOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [mobileOpen]);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className={cn('flex h-20 items-center border-b border-line px-4', collapsed ? 'justify-center' : 'gap-3')}>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-on-accent shadow-soft"><BookOpen className="size-5" aria-hidden="true" /></span>
        {!collapsed && <div className="min-w-0"><p className="truncate font-serif text-lg font-semibold text-ink">Autor Copilot</p><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Administração</p></div>}
        <button type="button" onClick={() => setMobileOpen(false)} className="ml-auto flex size-10 items-center justify-center rounded-control text-muted hover:bg-surface-muted lg:hidden" aria-label="Fechar menu"><X className="size-5" /></button>
      </div>

      <nav className="workspace-scrollbar flex-1 overflow-y-auto px-3 py-5" aria-label="Administração">
        {!collapsed && <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Centro de controle</p>}
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = icons[item.icon];
            const active = isCurrent(pathname, item.href);
            return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} aria-current={active ? 'page' : undefined} title={collapsed ? item.label : undefined} className={cn('group flex min-h-12 items-center rounded-xl text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', collapsed ? 'justify-center px-2' : 'gap-3 px-3', active ? 'bg-accent-subtle text-accent' : 'text-muted hover:bg-surface-muted hover:text-ink')}>
              <Icon className="size-[1.125rem] shrink-0" aria-hidden="true" />
              {!collapsed && <span className="min-w-0"><span className="block font-medium">{item.label}</span><span className="block truncate text-[10px] text-muted">{item.description}</span></span>}
            </Link>;
          })}
        </div>
      </nav>

      <div className="border-t border-line p-3">
        {!collapsed && <div className="mb-3 rounded-xl border border-line bg-surface-muted p-3"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Ambiente</p><p className="mt-1 text-xs font-medium capitalize text-ink">{environment}</p></div>}
        <Link href="/dashboard" className={cn('flex min-h-11 items-center rounded-xl text-sm text-muted hover:bg-surface-muted hover:text-ink', collapsed ? 'justify-center' : 'gap-3 px-3')} title={collapsed ? 'Voltar ao Autor Copilot' : undefined}><ChevronLeft className="size-4" />{!collapsed && 'Voltar ao Autor Copilot'}</Link>
      </div>
    </div>
  );

  return <div className="min-h-dvh bg-canvas text-ink">
    <a href="#admin-content" className="sr-only z-[100] rounded-control bg-accent text-on-accent px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Ir para o conteúdo</a>
    {mobileOpen && <button type="button" className="fixed inset-0 z-40 bg-ink/25 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Fechar menu administrativo" />}
    <aside className={cn('fixed inset-y-0 left-0 z-50 border-r border-line bg-surface shadow-floating transition-[width,transform] duration-200', collapsed ? 'w-20' : 'w-72', mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')} aria-label="Menu administrativo">{sidebar}</aside>

    <div className={cn('min-h-dvh transition-[padding] duration-200', collapsed ? 'lg:pl-20' : 'lg:pl-72')}>
      <header className="sticky top-0 z-30 flex min-h-20 items-center gap-3 border-b border-line bg-canvas/90 px-4 backdrop-blur-xl sm:px-6">
        <button type="button" onClick={() => setMobileOpen(true)} className="flex size-10 items-center justify-center rounded-control border border-line bg-surface text-ink lg:hidden" aria-label="Abrir menu"><Menu className="size-5" /></button>
        <button type="button" onClick={() => setCollapsed((value) => !value)} className="hidden size-9 items-center justify-center rounded-control text-muted hover:bg-surface-muted hover:text-ink lg:flex" aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}>{collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}</button>
        <div className="min-w-0"><p className="truncate text-sm font-semibold text-ink">{current?.label ?? 'Administração'}</p><p className="hidden truncate text-xs text-muted sm:block">{current?.description}</p></div>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <AdminCommandPalette commands={commands} />
          <div className="hidden text-right xl:block"><p className="text-sm font-medium text-ink">{displayName}</p><p className="text-xs text-muted">{roleLabel}</p></div>
          <Avatar className="size-9 border border-line"><AvatarFallback className="bg-accent-subtle text-xs font-semibold text-accent">{displayName.trim().charAt(0).toUpperCase()}</AvatarFallback></Avatar>
          <form action={adminLogout}><Button type="submit" variant="ghost" size="icon" aria-label="Sair da administração" title="Sair"><LogOut className="size-4" /></Button></form>
        </div>
      </header>
      <main id="admin-content" className="mx-auto w-full max-w-[96rem] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">{children}</main>
    </div>
  </div>;
}
