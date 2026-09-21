'use client';

import { LockKeyhole } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui';
import { accountSections } from '@/features/account/navigation';
import { cn } from '@/lib/cn';

const groups = [
  { label: 'Conta', slugs: ['overview', 'profile', 'login', 'security', 'sessions'] },
  { label: 'Preferências', slugs: ['writing', 'appearance', 'notifications', 'communications'] },
  { label: 'Dados e serviços', slugs: ['privacy', 'ai', 'usage', 'storage', 'extensions', 'collaboration', 'team', 'danger'] },
];

export function AccountNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const currentSection = accountSections.find((section) => section.href === pathname) ?? accountSections[0];

  return (
    <>
      <div className="lg:hidden">
        <label htmlFor="account-section" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted">Seção das configurações</label>
        <Select value={currentSection.href} onValueChange={(href) => router.push(href)}>
          <SelectTrigger id="account-section" aria-label="Escolher seção das configurações">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectGroup key={group.label}>
                <SelectLabel>{group.label}</SelectLabel>
                {group.slugs.map((slug) => {
                  const section = accountSections.find((item) => item.slug === slug)!;
                  return <SelectItem key={section.slug} value={section.href} disabled={section.status !== 'available'}>{section.label}{section.status !== 'available' ? ' · Em breve' : ''}</SelectItem>;
                })}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>

      <aside className="hidden border-r border-line pr-4 lg:sticky lg:top-24 lg:block lg:self-start" aria-label="Configurações da conta">
        <nav className="space-y-3">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">{group.label}</p>
              <div className="space-y-0.5">
                {group.slugs.map((slug) => {
                  const section = accountSections.find((item) => item.slug === slug)!;
                  const Icon = section.icon;
                  const active = pathname === section.href;
                  const available = section.status === 'available';
                  const classes = cn(
                    'group flex min-h-8 w-full items-center gap-2.5 rounded-control px-3 text-left text-[13px] transition-colors',
                    active ? 'bg-accent-subtle font-medium text-accent-active' : 'text-muted',
                    available ? 'hover:bg-surface-muted hover:text-ink' : 'cursor-not-allowed opacity-65',
                  );

                  if (available) return <Link key={slug} href={section.href} className={classes}><Icon className="size-4 shrink-0" /><span className="min-w-0 truncate">{section.label}</span></Link>;

                  return (
                    <button key={slug} type="button" disabled className={classes} aria-label={`${section.label}, em breve`} title="Em breve">
                      <Icon className="size-4 shrink-0" /><span className="min-w-0 truncate">{section.label}</span><LockKeyhole className="ml-auto size-3.5 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
