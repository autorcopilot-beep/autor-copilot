'use client';

import { BookOpenText, ChartNoAxesCombined, Headphones, House, LibraryBig, PenLine, Settings2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { cn } from '@/lib/cn';
import { SoundMegaMenu } from '@/features/sound/components/sound-mega-menu';
import type { SoundTrack } from '@/features/sound/types';

export function WritingRail({ displayName, avatarUrl, soundEnabled = false, soundTracks = [] }: { displayName: string; avatarUrl?: string; soundEnabled?: boolean; soundTracks?: SoundTrack[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [soundOpen, setSoundOpen] = useState(() => soundEnabled && searchParams.get('sound') === 'open');
  const workId = searchParams.get('work');
  const writingLink = (view: string) => `/write/${view}${workId ? `?work=${encodeURIComponent(workId)}` : ''}`;
  const items = [
    { label: 'Início', href: '/dashboard', icon: House, active: pathname.startsWith('/dashboard') },
    { label: 'Biblioteca', href: '/library/all', icon: LibraryBig, active: pathname.startsWith('/library') },
    { label: 'Visão geral', href: '/overview/dashboard', icon: ChartNoAxesCombined, active: pathname.startsWith('/overview') },
    { label: 'Editor', href: writingLink('editor'), icon: PenLine, active: pathname.startsWith('/write') && pathname !== '/write/encyclopedia' },
    { label: 'Enciclopédia', href: writingLink('encyclopedia'), icon: BookOpenText, active: pathname === '/write/encyclopedia' },
  ];

  useEffect(() => {
    const openSound = () => { if (soundEnabled) setSoundOpen(true); };
    window.addEventListener('autor-copilot:open-sound', openSound);
    return () => window.removeEventListener('autor-copilot:open-sound', openSound);
  }, [soundEnabled]);

  return (
    <header className="writing-nav-capsule" aria-label="Navegação principal">
      <Link href="/dashboard" className="writing-nav-brand" aria-label="Autor Copilot — início" title="Autor Copilot"><BookOpenText className="size-5" /></Link>
      <nav className="writing-nav-links" aria-label="Áreas do Autor Copilot">
        {items.map(({ label, href, icon: Icon, active }) => (
          <Link key={label} href={href} aria-label={label} aria-current={active ? 'page' : undefined} title={label} className={cn('writing-nav-link', active && 'writing-nav-link-active')}>
            <Icon className="size-[18px]" aria-hidden="true" /><span>{label}</span>
          </Link>
        ))}
        {soundEnabled && <button type="button" onClick={() => setSoundOpen(true)} aria-label="Som" aria-expanded={soundOpen} title="Som da obra" className={cn('writing-nav-link', soundOpen && 'writing-nav-link-active')}><Headphones className="size-[18px]" aria-hidden="true" /><span>Som</span></button>}
      </nav>
      <span className="writing-nav-divider" aria-hidden="true" />
      <Link href="/account" className="writing-nav-account" title="Configurações da conta" aria-label="Configurações da conta"><Settings2 className="size-[18px]" /></Link>
      <Link href="/account/profile" className="writing-nav-profile" title={displayName} aria-label={`Perfil de ${displayName}`}>
        <Avatar className="writing-nav-avatar"><AvatarImage src={avatarUrl} alt={`Foto de ${displayName}`} /><AvatarFallback>{displayName.trim().charAt(0).toLocaleUpperCase('pt-BR')}</AvatarFallback></Avatar>
      </Link>
      <SoundMegaMenu open={soundOpen} onClose={() => setSoundOpen(false)} tracks={soundTracks} />
    </header>
  );
}
