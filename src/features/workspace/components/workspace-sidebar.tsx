'use client';

import { BookOpenText, ChevronDown, ChevronRight, ChevronsUpDown, LogOut, PanelLeftClose, PanelLeftOpen, Plus, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';

import { Collapsible, CollapsibleContent, CollapsibleTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui';
import { logout } from '@/features/auth/actions/logout';
import { OperationalTagBadge } from '@/features/workspace/components/operational-tag';
import { contextOptions, footerNavigation, platformNavigation, workNavigation } from '@/features/workspace/navigation';
import { brandImage } from '@/lib/brand-image';

function ContextSelector({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Selecionar ambiente de trabalho" title={collapsed ? 'Meu espaço' : undefined} className={`flex min-h-12 w-full items-center rounded-control border border-line bg-surface-muted text-left outline-none transition-colors hover:border-line-strong focus-visible:ring-2 focus-visible:ring-focus ${collapsed ? 'justify-center px-1.5' : 'gap-3 px-3'}`}>
        <span className="flex size-8 items-center justify-center rounded-control bg-accent text-on-accent"><BookOpenText className="size-4" /></span>
        {!collapsed && <><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-ink">Meu espaço</span><span className="block truncate text-xs text-muted">Espaço pessoal</span></span><ChevronsUpDown className="size-4 text-muted" /></>}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Ambientes de trabalho</DropdownMenuLabel>
        {contextOptions.map(({ label, icon: Icon }, index) => (
          <DropdownMenuItem key={label} disabled={index !== 0}><Icon className="size-4" /><span className="flex-1">{label}</span>{index !== 0 && <OperationalTagBadge tag="Em breve" compact />}</DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled><Plus className="size-4" />Criar ambiente<OperationalTagBadge tag="Em breve" compact /></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function WorkItem({ item, collapsed = false }: { item: (typeof workNavigation)[number]; collapsed?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = Boolean(item.href && (pathname === item.href || pathname.startsWith(`${item.href.split('/').slice(0, 2).join('/')}/`)));
  const Icon = item.icon;
  if (collapsed) {
    if (item.href) {
      return (
        <Link href={item.href} title={item.label} aria-label={item.label} aria-current={active ? 'page' : undefined} className={`relative flex min-h-10 w-full items-center justify-center rounded-control transition-colors hover:bg-accent-subtle hover:text-accent ${active ? 'bg-accent-subtle text-accent' : 'text-muted'}`}>
          <Icon className="size-[18px]" aria-hidden="true" />
        </Link>
      );
    }
    return (
      <button type="button" disabled title={`${item.label} — Em breve`} aria-label={`${item.label}, em breve`} className="relative flex min-h-10 w-full cursor-not-allowed items-center justify-center rounded-control text-muted">
        <Icon className="size-[18px]" aria-hidden="true" />
      </button>
    );
  }

  return (
    <Collapsible open={open || active} onOpenChange={setOpen}>
      {item.href ? (
        <div className={`group flex min-h-10 w-full items-center rounded-control text-sm transition-colors hover:bg-surface-muted ${active ? 'bg-accent-subtle text-accent' : 'text-ink'}`}>
          <Link href={item.href} aria-current={active ? 'page' : undefined} className="flex min-w-0 flex-1 items-center gap-2 self-stretch px-2.5">
            <Icon className={`size-4 shrink-0 ${active ? 'text-accent' : 'text-muted group-hover:text-accent'}`} aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate font-medium">{item.label}</span>
            {item.tag && <OperationalTagBadge tag={item.tag} compact />}
          </Link>
          <CollapsibleTrigger className="flex size-10 shrink-0 items-center justify-center rounded-control text-muted hover:text-accent" aria-label={`${open || active ? 'Recolher' : 'Expandir'} ${item.label}`}>
            {open || active ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
          </CollapsibleTrigger>
        </div>
      ) : (
        <CollapsibleTrigger className="group flex min-h-10 w-full items-center gap-2 rounded-control px-2.5 text-left text-sm text-ink transition-colors hover:bg-surface-muted">
          <Icon className="size-4 shrink-0 text-muted group-hover:text-accent" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate font-medium">{item.label}</span>
          {item.tag && <OperationalTagBadge tag={item.tag} compact />}
          {open ? <ChevronDown className="size-3.5 text-muted" /> : <ChevronRight className="size-3.5 text-muted" />}
        </CollapsibleTrigger>
      )}
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-[auth-fade-out_100ms_ease-in] data-[state=open]:animate-[auth-fade-in_150ms_ease-out]">
        <div className="ml-4 border-l border-line py-1 pl-3">
          {item.children.map((child) => child.href ? (
            <Link key={child.label} href={child.href} aria-current={pathname === child.href ? 'page' : undefined} className={`flex min-h-9 w-full items-center gap-2 rounded-control px-2 text-left text-xs transition-colors hover:bg-accent-subtle hover:text-accent ${pathname === child.href ? 'bg-accent-subtle font-medium text-accent' : 'text-muted'}`}>
              <span className="flex-1">{child.label}</span>{child.tag && <OperationalTagBadge tag={child.tag} compact />}
            </Link>
          ) : (
            <button key={child.label} type="button" disabled className="flex min-h-9 w-full items-center gap-2 rounded-control px-2 text-left text-xs text-muted disabled:cursor-not-allowed">
              <span className="flex-1">{child.label}</span>{child.tag && <OperationalTagBadge tag={child.tag} compact />}
            </button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function SidebarContent({ mobile = false, collapsed = false, onCollapsedChange }: { mobile?: boolean; collapsed?: boolean; onCollapsedChange?: (collapsed: boolean) => void }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className={`flex items-center gap-2 pb-4 ${collapsed ? 'flex-col px-0' : 'justify-between px-2'}`}>
        <div className="flex min-h-11 items-center gap-2 font-semibold tracking-wide text-ink">
          {brandImage ? <Image src={brandImage} alt="" width={28} height={28} className="size-7 object-contain" /> : <BookOpenText className="size-6 text-accent" />}
          {!collapsed && <span>AUTOR COPILOT</span>}
        </div>
        {mobile && <DialogPrimitive.Close className="flex size-10 items-center justify-center rounded-full text-muted hover:bg-surface-muted" aria-label="Fechar navegação"><X className="size-5" /></DialogPrimitive.Close>}
        {!mobile && onCollapsedChange && <button type="button" onClick={() => onCollapsedChange(!collapsed)} className="flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-ink" aria-label={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'} title={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}>{collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}</button>}
      </div>

      <ContextSelector collapsed={collapsed} />

      <div className={`workspace-scrollbar mt-5 min-h-0 flex-1 overflow-y-auto ${collapsed ? 'pr-0' : 'pr-1'}`}>
        {!collapsed && <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Funções de trabalho</p>}
        <nav className="space-y-0.5" aria-label="Funções de trabalho">{workNavigation.map((item) => <WorkItem key={item.label} item={item} collapsed={collapsed} />)}</nav>

        {!collapsed && <p className="mt-6 px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Plataforma</p>}
        {collapsed && <div className="my-3 border-t border-line" />}
        <nav className="space-y-0.5" aria-label="Plataforma">
          {platformNavigation.map(({ label, icon: Icon, tag }) => (
            <button key={label} type="button" disabled title={collapsed ? `${label} — Em breve` : undefined} className={`relative flex min-h-10 w-full cursor-not-allowed items-center rounded-control text-sm text-muted ${collapsed ? 'justify-center px-1' : 'gap-2 px-2.5 text-left'}`}>
              <Icon className="size-4" />{!collapsed && <><span className="flex-1">{label}</span><OperationalTagBadge tag={tag} compact /></>}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-4 border-t border-line pt-3">
        {footerNavigation.map(({ label, icon: Icon, tag }) => (
          tag ? (
            <button key={label} type="button" disabled title={collapsed ? `${label} — Em breve` : undefined} className={`flex min-h-9 w-full cursor-not-allowed items-center rounded-control text-xs text-muted ${collapsed ? 'justify-center px-1' : 'gap-2 px-2.5 text-left'}`}>
              <Icon className="size-4" />{!collapsed && <><span className="flex-1">{label}</span><OperationalTagBadge tag={tag} compact /></>}
            </button>
          ) : (
            <Link key={label} href="/account" title={collapsed ? label : undefined} className={`flex min-h-9 w-full items-center rounded-control text-xs text-muted transition-colors hover:bg-surface-muted hover:text-ink ${collapsed ? 'justify-center px-1' : 'gap-2 px-2.5 text-left'}`}>
              <Icon className="size-4" />{!collapsed && <span className="flex-1">{label}</span>}
            </Link>
          )
        ))}
        <form action={logout}>
          <button type="submit" title={collapsed ? 'Sair' : undefined} className={`mt-1 flex min-h-10 w-full items-center rounded-control text-sm text-muted transition-colors hover:bg-danger-subtle hover:text-danger ${collapsed ? 'justify-center px-1' : 'gap-2 px-2.5 text-left'}`}>
            <LogOut className="size-4" />{!collapsed && <span>Sair</span>}
          </button>
        </form>
      </div>
    </div>
  );
}

export function WorkspaceSidebar({ mobile = false, collapsed = false, onCollapsedChange }: { mobile?: boolean; collapsed?: boolean; onCollapsedChange?: (collapsed: boolean) => void }) {
  if (!mobile) return <aside className={`sticky top-4 hidden h-[calc(100dvh-2rem)] shrink-0 self-start rounded-card border border-line bg-surface p-3 shadow-soft transition-[width] duration-150 lg:block ${collapsed ? 'w-[4.5rem]' : 'w-[18rem]'}`}><SidebarContent collapsed={collapsed} onCollapsedChange={onCollapsedChange} /></aside>;

  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>
        <button type="button" className="flex size-11 items-center justify-center rounded-full border border-line bg-surface shadow-soft lg:hidden" aria-label="Abrir navegação">
          <BookOpenText className="size-5 text-accent" />
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/35 data-[state=closed]:animate-[auth-fade-out_150ms_ease-in] data-[state=open]:animate-[auth-fade-in_150ms_ease-out]" />
        <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-50 w-[min(20rem,calc(100vw-2rem))] bg-surface p-4 shadow-floating outline-none data-[state=closed]:animate-[panel-left-out_150ms_ease-in] data-[state=open]:animate-[panel-left-in_180ms_ease-out]">
          <DialogPrimitive.Title className="sr-only">Navegação do Autor Copilot</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">Escolha um ambiente ou abra uma área de trabalho.</DialogPrimitive.Description>
          <SidebarContent mobile />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
