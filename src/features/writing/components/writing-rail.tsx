'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Clock3, Network, Search, Wrench } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { applyAccessibilityPreferences, readAccessibilityPreferences, saveAccessibilityPreferences } from '@/features/accessibility/preferences';
import { SoundMegaMenu } from '@/features/sound/components/sound-mega-menu';
import type { SoundTrack } from '@/features/sound/types';
import { navigateWritingView, writingViewEvent, writingViewFromPathname } from '@/features/writing/spa-navigation';
import type { WritingView } from '@/features/writing/types';
import {
  BookMark, EditorIcon, EncyclopediaIcon, HomeIcon, LibraryIcon,
  OverviewIcon, SettingsIcon, SoundIcon, ThemeIcon,
} from '@/features/writing/components/writing-nav-icons';
import { cn } from '@/lib/cn';

type NavItem = { id: string; label: string; href?: string; active: boolean; icon: typeof HomeIcon; action?: () => void };

export function WritingRail({ displayName, avatarUrl, soundEnabled = false, soundTracks = [] }: { displayName: string; avatarUrl?: string; soundEnabled?: boolean; soundTracks?: SoundTrack[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const workId = searchParams.get('work');
  const [currentWritingView, setCurrentWritingView] = useState<WritingView | null>(() => writingViewFromPathname(pathname));
  const [expanded, setExpanded] = useState(false);
  const [toolsExpanded, setToolsExpanded] = useState(false);
  const [soundOpen, setSoundOpen] = useState(() => soundEnabled && searchParams.get('sound') === 'open');
  const [dark, setDark] = useState(false);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });
  const rootRef = useRef<HTMLElement>(null);
  const toolsRootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const writingLink = (view: string) => `/write/${view}${workId ? `?work=${encodeURIComponent(workId)}` : ''}`;
  const items: NavItem[] = [
    { id: 'inicio', label: 'Início', href: '/dashboard', icon: HomeIcon, active: pathname.startsWith('/dashboard') },
    { id: 'biblioteca', label: 'Biblioteca', href: '/library/all', icon: LibraryIcon, active: pathname.startsWith('/library') },
    { id: 'visao', label: 'Visão geral', href: '/overview/dashboard', icon: OverviewIcon, active: pathname.startsWith('/overview') },
    { id: 'editor', label: 'Editor', href: writingLink('editor'), icon: EditorIcon, active: Boolean(currentWritingView && !['encyclopedia', 'relations'].includes(currentWritingView)) },
    { id: 'enciclopedia', label: 'Enciclopédia', href: writingLink('encyclopedia'), icon: EncyclopediaIcon, active: currentWritingView === 'encyclopedia' },
    ...(soundEnabled ? [{ id: 'som', label: 'Som', icon: SoundIcon, active: soundOpen, action: () => setSoundOpen(true) }] : []),
  ];
  const activeIndex = Math.max(0, items.findIndex((item) => item.active));

  const measure = useCallback(() => {
    const item = itemRefs.current[activeIndex];
    const list = listRef.current;
    if (!item || !list) return;
    const listBox = list.getBoundingClientRect();
    const itemBox = item.getBoundingClientRect();
    setPill({ left: itemBox.left - listBox.left, width: itemBox.width, ready: true });
  }, [activeIndex]);

  useLayoutEffect(measure, [expanded, measure]);

  useEffect(() => {
    const syncFromLocation = () => setCurrentWritingView(writingViewFromPathname(window.location.pathname));
    const handleView = (event: Event) => {
      const view = (event as CustomEvent<{ view?: WritingView }>).detail?.view;
      if (view) setCurrentWritingView(view);
    };
    window.addEventListener('popstate', syncFromLocation);
    window.addEventListener(writingViewEvent, handleView);
    return () => {
      window.removeEventListener('popstate', syncFromLocation);
      window.removeEventListener(writingViewEvent, handleView);
    };
  }, []);

  useEffect(() => {
    const preferences = readAccessibilityPreferences();
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const frame = window.requestAnimationFrame(() => setDark(preferences.theme === 'dark' || (preferences.theme === 'system' && systemDark)));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const timer = window.setTimeout(measure, 440);
    const closeOnOutside = (event: PointerEvent) => { if (rootRef.current && !rootRef.current.contains(event.target as Node)) setExpanded(false); };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setExpanded(false); };
    window.addEventListener('resize', measure);
    window.addEventListener('pointerdown', closeOnOutside);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', measure);
      window.removeEventListener('pointerdown', closeOnOutside);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [expanded, measure]);

  useEffect(() => {
    if (!toolsExpanded) return;
    const closeOnOutside = (event: PointerEvent) => { if (toolsRootRef.current && !toolsRootRef.current.contains(event.target as Node)) setToolsExpanded(false); };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setToolsExpanded(false); };
    window.addEventListener('pointerdown', closeOnOutside);
    window.addEventListener('keydown', closeOnEscape);
    return () => { window.removeEventListener('pointerdown', closeOnOutside); window.removeEventListener('keydown', closeOnEscape); };
  }, [toolsExpanded]);

  useEffect(() => {
    const openSound = () => { if (soundEnabled) { setExpanded(true); setSoundOpen(true); } };
    window.addEventListener('autor-copilot:open-sound', openSound);
    return () => window.removeEventListener('autor-copilot:open-sound', openSound);
  }, [soundEnabled]);

  function toggleTheme() {
    const nextDark = !dark;
    const preferences = { ...readAccessibilityPreferences(), theme: nextDark ? 'dark' as const : 'light' as const };
    setDark(nextDark);
    applyAccessibilityPreferences(preferences);
    saveAccessibilityPreferences(preferences);
  }

  function handleArrowNavigation(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const current = itemRefs.current.findIndex((item) => item === document.activeElement);
    const origin = current >= 0 ? current : activeIndex;
    const next = event.key === 'ArrowRight' ? (origin + 1) % items.length : (origin - 1 + items.length) % items.length;
    itemRefs.current[next]?.focus();
  }

  function handleWritingLink(event: React.MouseEvent<HTMLAnchorElement>, itemId: string, href?: string) {
    if (!href || !pathname.startsWith('/write') || (itemId !== 'editor' && itemId !== 'enciclopedia')) return;
    event.preventDefault();
    const view: WritingView = itemId === 'enciclopedia' ? 'encyclopedia' : 'editor';
    setCurrentWritingView(view);
    navigateWritingView(view, href);
    setExpanded(false);
  }

  function openTool(view: WritingView) {
    const href = writingLink(view);
    setCurrentWritingView(view);
    if (pathname.startsWith('/write')) navigateWritingView(view, href);
    else window.location.assign(href);
    setToolsExpanded(false);
  }

  return <><header ref={rootRef} className={cn('writing-nav-capsule', expanded && 'writing-nav-capsule-expanded')} aria-label="Navegação principal" onKeyDown={handleArrowNavigation}>
    <button type="button" data-tour="writing-navigation" onClick={() => setExpanded((current) => !current)} aria-expanded={expanded} aria-label={expanded ? 'Recolher navegação' : 'Abrir navegação'} className={cn('writing-nav-brand writing-nav-trigger', !expanded && 'writing-nav-trigger-idle')}>
      <span className="writing-nav-sheen" aria-hidden="true" />
      <span className="writing-nav-book" style={{ transform: expanded ? 'rotateY(0deg)' : 'rotateY(-24deg) scale(.96)' }}><BookMark size={23} /></span>
    </button>
    <div ref={listRef} className="writing-nav-reveal" style={{ maxWidth: expanded ? '58rem' : 0, opacity: expanded ? 1 : 0 }} aria-hidden={!expanded}>
      <span className="writing-nav-active-pill" style={{ left: pill.left, width: pill.width, opacity: pill.ready ? 1 : 0 }} aria-hidden="true" />
      <nav className="writing-nav-links" aria-label="Áreas do Autor Copilot">
        {items.map((item, index) => {
          const Icon = item.icon;
          const className = cn('writing-nav-link writing-nav-animated-item', item.active && 'writing-nav-link-active');
          const style = { '--writing-nav-delay': `${expanded ? index * 42 : 0}ms` } as React.CSSProperties;
          const content = <><span className="relative z-10 flex"><Icon size={18} active={item.active} /></span><span className="relative z-10">{item.label}</span></>;
          const tourTarget = item.id === 'editor' ? 'writing-nav-editor' : item.id === 'enciclopedia' ? 'writing-nav-encyclopedia' : item.id === 'som' ? 'sound-menu' : undefined;
          if (item.href) return <Link key={item.id} data-tour={tourTarget} ref={(element) => { itemRefs.current[index] = element; }} href={item.href} onClick={(event) => handleWritingLink(event, item.id, item.href)} aria-current={item.active ? 'page' : undefined} tabIndex={expanded ? 0 : -1} className={className} style={style}>{content}</Link>;
          return <button key={item.id} data-tour={tourTarget} ref={(element) => { itemRefs.current[index] = element; }} type="button" onClick={item.action} aria-pressed={item.active} tabIndex={expanded ? 0 : -1} className={className} style={style}>{content}</button>;
        })}
      </nav>
      <span className="writing-nav-divider" aria-hidden="true" />
      <button type="button" onClick={toggleTheme} tabIndex={expanded ? 0 : -1} aria-label={dark ? 'Usar tema claro' : 'Usar tema escuro'} aria-pressed={dark} className="writing-nav-account writing-nav-animated-item" style={{ '--writing-nav-delay': `${items.length * 42}ms` } as React.CSSProperties}><ThemeIcon size={18} dark={dark} active /></button>
      <Link href="/account" tabIndex={expanded ? 0 : -1} className="writing-nav-account writing-nav-gear writing-nav-animated-item" style={{ '--writing-nav-delay': `${(items.length + 1) * 42}ms` } as React.CSSProperties} title="Configurações" aria-label="Configurações"><span className="writing-nav-gear-icon"><SettingsIcon size={18} /></span></Link>
      <Link href="/account/profile" tabIndex={expanded ? 0 : -1} className="writing-nav-profile writing-nav-animated-item" style={{ '--writing-nav-delay': `${(items.length + 2) * 42}ms` } as React.CSSProperties} title={displayName} aria-label={`Perfil de ${displayName}`}>
        <Avatar className="writing-nav-avatar"><AvatarImage src={avatarUrl} alt={`Foto de ${displayName}`} /><AvatarFallback>{displayName.trim().charAt(0).toLocaleUpperCase('pt-BR')}</AvatarFallback></Avatar>
      </Link>
    </div>
    <SoundMegaMenu open={soundOpen} onClose={() => setSoundOpen(false)} tracks={soundTracks} />
  </header>
  <header ref={toolsRootRef} className={cn('writing-tools-capsule writing-nav-capsule', toolsExpanded && 'writing-nav-capsule-expanded')} aria-label="Ferramentas da obra">
    <button type="button" data-tour="writing-tools" onClick={() => { setToolsExpanded((value) => !value); setExpanded(false); }} aria-expanded={toolsExpanded} aria-label={toolsExpanded ? 'Recolher ferramentas' : 'Abrir ferramentas'} className={cn('writing-nav-brand writing-tools-trigger', !toolsExpanded && 'writing-nav-trigger-idle')}>
      <span className="writing-nav-sheen" aria-hidden="true" /><Wrench className="relative size-5" />
    </button>
    <div className="writing-nav-reveal" style={{ maxWidth: toolsExpanded ? '32rem' : 0, opacity: toolsExpanded ? 1 : 0 }} aria-hidden={!toolsExpanded}>
      <nav className="writing-nav-links px-1" aria-label="Ferramentas narrativas">
        <button type="button" data-tour="writing-nav-relations" onClick={() => openTool('relations')} tabIndex={toolsExpanded ? 0 : -1} className={cn('writing-nav-link writing-nav-animated-item', currentWritingView === 'relations' && 'writing-nav-link-active')} style={{ '--writing-nav-delay': '0ms' } as React.CSSProperties}><Network className="size-4" /><span>Relações</span></button>
        <span className="writing-nav-link writing-nav-animated-item opacity-60" title="Em breve" style={{ '--writing-nav-delay': '42ms' } as React.CSSProperties}><Clock3 className="size-4" /><span>Cronologia</span></span>
        <span className="writing-nav-link writing-nav-animated-item opacity-60" title="Em breve" style={{ '--writing-nav-delay': '84ms' } as React.CSSProperties}><Search className="size-4" /><span>Pesquisa</span></span>
      </nav>
    </div>
  </header></>;
}
