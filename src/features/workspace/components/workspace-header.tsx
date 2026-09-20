'use client';

import { Bell, ChevronDown, Home, LogOut, Search, Settings, SlidersHorizontal, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarGroup,
  AvatarGroupCount,
  AvatarStatus,
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui';
import { logout } from '@/features/auth/actions/logout';
import { OperationalTagBadge } from '@/features/workspace/components/operational-tag';
import { WorkspaceSidebar } from '@/features/workspace/components/workspace-sidebar';

type WorkspaceHeaderProps = {
  displayName: string;
  email?: string;
  penName?: string;
  avatarUrl?: string;
  showWorkspaceMenu?: boolean;
};

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase('pt-BR');
}

function ResponsiveBreadcrumb() {
  const pathname = usePathname();
  const isAccountArea = pathname === '/account' || pathname.startsWith('/account/');
  const current = pathname === '/dashboard' ? 'Mesa de escrita' : pathname.startsWith('/overview') ? 'Visão geral' : pathname.startsWith('/library') ? 'Biblioteca' : pathname === '/account' ? 'Conta' : pathname.startsWith('/account/') ? 'Configurações' : 'Área de trabalho';
  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem>
          {isAccountArea ? <Link href="/dashboard" className="inline-flex items-center gap-1.5 transition-colors hover:text-ink"><Home className="size-3.5" />Início</Link> : 'Meu espaço'}
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {!isAccountArea && <BreadcrumbItem className="hidden md:inline-flex">
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-control outline-none hover:text-ink" aria-label="Abrir caminhos anteriores"><BreadcrumbEllipsis /></DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Caminhos anteriores</DropdownMenuLabel>
              <DropdownMenuItem asChild><Link href="/library/all">Biblioteca</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/write/editor">Minha obra atual</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>}
        {!isAccountArea && <BreadcrumbSeparator className="hidden md:list-item" />}
        <BreadcrumbItem><BreadcrumbPage className="max-w-28 truncate sm:max-w-none">{current}</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function WorkspaceAvatarGroup({ names }: { names: string[] }) {
  const visible = names.slice(0, 3);
  const remaining = names.length - visible.length;
  return (
    <AvatarGroup aria-label={`${names.length} colaboradores neste espaço`}>
      {visible.map((name) => <Avatar key={name} className="size-8 border-2 border-surface"><AvatarFallback className="text-[10px]">{initials(name)}</AvatarFallback></Avatar>)}
      {remaining > 0 && <AvatarGroupCount>+{remaining}</AvatarGroupCount>}
    </AvatarGroup>
  );
}

export function WorkspaceHeader({ displayName, email, penName, avatarUrl, showWorkspaceMenu = true }: WorkspaceHeaderProps) {
  const publicName = penName || displayName;
  return (
    <header className="sticky top-0 z-40 grid grid-cols-[auto_1fr_auto] items-center gap-2 py-4 sm:gap-3 lg:grid-cols-[minmax(12rem,1fr)_minmax(16rem,32rem)_minmax(12rem,1fr)]">
      <div className="flex items-center gap-2">
        {showWorkspaceMenu && <WorkspaceSidebar mobile />}
        <div className="flex min-h-11 min-w-0 items-center rounded-full border border-line bg-surface px-4 shadow-soft"><ResponsiveBreadcrumb /></div>
      </div>

      <div className="relative hidden w-full sm:block">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input disabled type="search" placeholder="Buscar em todo o Autor Copilot" aria-label="Busca global, em breve" className="min-h-11 w-full cursor-not-allowed rounded-full border border-line bg-surface pl-11 pr-24 text-sm text-ink shadow-soft outline-none placeholder:text-muted" />
        <span className="absolute right-3 top-1/2 -translate-y-1/2"><OperationalTagBadge tag="Em breve" compact /></span>
      </div>

      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface p-1.5 pr-3 text-left shadow-soft outline-none transition-colors hover:border-line-strong focus-visible:ring-2 focus-visible:ring-focus">
            <Avatar className="size-8">{avatarUrl && <AvatarImage src={avatarUrl} alt="" />}<AvatarFallback className="text-xs">{initials(publicName)}</AvatarFallback><AvatarStatus online /></Avatar>
            <span className="hidden max-w-28 truncate text-sm font-medium text-ink xl:block">{publicName}</span>
            <ChevronDown className="hidden size-3.5 text-muted sm:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="normal-case tracking-normal">
              <span className="block truncate text-sm font-semibold text-ink">{publicName}</span>
              {email && <span className="mt-0.5 block truncate text-xs font-normal text-muted">{email}</span>}
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-normal text-success"><span className="size-2 rounded-full bg-success" />Online</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/account/profile"><UserRound className="size-4" />Configurações de perfil</Link></DropdownMenuItem>
            <DropdownMenuItem disabled><Settings className="size-4" />Preferências<span className="ml-auto"><OperationalTagBadge tag="Em breve" compact /></span></DropdownMenuItem>
            <DropdownMenuItem disabled><SlidersHorizontal className="size-4" />Conta e plano<span className="ml-auto"><OperationalTagBadge tag="Em breve" compact /></span></DropdownMenuItem>
            <DropdownMenuItem disabled><Bell className="size-4" />Notificações<span className="ml-auto"><OperationalTagBadge tag="Em breve" compact /></span></DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action={logout}><DropdownMenuItem asChild><button type="submit" className="w-full text-danger focus:bg-danger-subtle focus:text-danger"><LogOut className="size-4" />Sair</button></DropdownMenuItem></form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
