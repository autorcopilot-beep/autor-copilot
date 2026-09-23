'use client';

import { Braces, Compass, FileClock, FileText, Flag, Gauge, Headphones, Megaphone, Package, Search, ShieldCheck, Sparkles, UserPlus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

export type AdminCommand = {
  href: string;
  label: string;
  keywords: string;
  icon: 'dashboard' | 'admins' | 'new-admin' | 'audit' | 'users' | 'extensions' | 'sound' | 'flags' | 'guidance' | 'archetypes' | 'legal' | 'publish' | 'api';
};

const icons = {
  dashboard: Gauge,
  admins: Users,
  'new-admin': UserPlus,
  audit: FileClock,
  users: Users,
  extensions: Package,
  sound: Headphones,
  flags: Flag,
  guidance: Compass,
  archetypes: Sparkles,
  legal: FileText,
  publish: Megaphone,
  api: Braces,
};

export function AdminCommandPalette({ commands }: { commands: AdminCommand[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const run = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="hidden min-h-10 w-full max-w-xs items-center gap-2 rounded-control border border-line bg-surface px-3 text-left text-sm text-muted shadow-soft transition-colors hover:border-line-strong hover:text-ink md:flex">
        <Search className="size-4" aria-hidden="true" /><span className="flex-1">Buscar no Admin</span><kbd className="rounded border border-line bg-surface-muted px-1.5 py-0.5 text-[10px] text-muted">Ctrl K</kbd>
      </button>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex size-10 items-center justify-center rounded-control border border-line bg-surface text-muted hover:bg-surface-muted hover:text-ink md:hidden" aria-label="Abrir busca global"><Search className="size-4" /></button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Navegação da administração">
        <Command>
          <CommandInput placeholder="Digite uma página ou ação…" />
          <CommandList>
            <CommandEmpty>Nenhum comando encontrado.</CommandEmpty>
            <CommandGroup heading="Navegação">
              {commands.map((command) => {
                const Icon = icons[command.icon] ?? ShieldCheck;
                return (
                  <CommandItem key={command.href} value={`${command.label} ${command.keywords}`} onSelect={() => run(command.href)}>
                    <Icon aria-hidden="true" /><span>{command.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
