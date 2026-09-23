'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, BookOpenText, ChevronDown, Menu, X } from 'lucide-react';
import { publicPages } from './catalog';
import { EditorialMenu, EditorialFooter } from './editorial-navigation';
import { CookiePreferences } from './cookie-preferences';

const publicRoots = new Set(['', ...Object.keys(publicPages), 'precos', 'demo', 'cookies', 'faq', 'legal', 'blog', 'ajuda', 'status', 'updates', 'publicacoes', 'comunicados', 'newsletters']);
export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (!publicRoots.has(pathname.split('/')[1])) return children;
  return <div className="ac-public"><a className="ac-skip" href="#public-content">Pular para o conteúdo</a><PublicHeader key={pathname} /><div id="public-content" tabIndex={-1}>{children}</div><EditorialFooter /><CookiePreferences /></div>;
}

function PublicHeader() {
  const [menu, setMenu] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const header = useRef<HTMLElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    function outside(event: PointerEvent) { if (!header.current?.contains(event.target as Node)) { setMenu(null); setMobile(false); } }
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, []);
  return <header ref={header} className="ac-header" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setMenu(null); }} onKeyDown={(event) => { if (event.key === 'Escape') { if (menu !== null) buttons.current[menu]?.focus(); setMenu(null); setMobile(false); } }}>
    <div className="ac-nav-capsule"><Link className="ac-brand" href="/" aria-label="Autor Copilot, início"><BookOpenText size={25} /><span>autor<span className="ac-brand-light">copilot</span><small>ESPAÇO PARA CRIAR</small></span></Link>
      <nav aria-label="Navegação principal" className={mobile ? 'ac-nav-links is-open' : 'ac-nav-links'}>
        {['Produto', 'Recursos', 'Empresa'].map((name, index) => <button key={name} ref={(node) => { buttons.current[index] = node; }} aria-expanded={menu === index} aria-controls={`public-menu-${index}`} onClick={() => setMenu(menu === index ? null : index)}>{name}<ChevronDown size={13} /></button>)}
        <Link href="/precos">Preços</Link>
      </nav><div className="ac-nav-account"><Link href="/login">Entrar</Link><Link className="ac-button" href="/register">Criar meu espaço <ArrowUpRight size={15} /></Link></div><button className="ac-mobile-toggle" aria-label={mobile ? 'Fechar navegação' : 'Abrir navegação'} aria-expanded={mobile} onClick={() => { setMobile(!mobile); setMenu(null); }}>{mobile ? <X /> : <Menu />}</button>
    </div>
    {menu !== null && <div id={`public-menu-${menu}`} className={`ac-megamenu ac-editorial-mega ac-mega-${menu}`} key={menu}><EditorialMenu index={menu} /></div>}
  </header>;
}


