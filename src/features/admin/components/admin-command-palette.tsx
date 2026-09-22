'use client';

import { FileClock, FileText, Flag, Gauge, Package, Search, ShieldCheck, UserPlus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

export type AdminCommand = {
  href: string;
  label: string;
  keywords: string;
  icon: 'dashboard' | 'admins' | 'new-admin' | 'audit' | 'users' | 'extensions' | 'flags' | 'legal';
};

const icons = {
  dashboard: Gauge,
  admins: Users,
  'new-admin': UserPlus,
  audit: FileClock,
  users: Users,
  extensions: Package,
  flags: Flag,
  legal: FileText,
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
      <button type="button" onClick={() => setOpen(true)} className="hidden min-h-10 w-full max-w-xs items-center gap-2 rounded-control border border-white/10 bg-black/20 px-3 text-left text-sm text-white/45 transition-colors hover:border-white/20 hover:text-white/70 md:flex">
        <Search className="size-4" aria-hidden="true" /><span className="flex-1">Buscar no God Mode</span><kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-white/40">Ctrl K</kbd>
      </button>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex size-10 items-center justify-center rounded-control border border-white/10 text-white/60 hover:bg-white/10 md:hidden" aria-label="Abrir busca global"><Search className="size-4" /></button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Navegação do God Mode">
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
