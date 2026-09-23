import {
  BarChart3,
  GitBranch,
  Library,
  LifeBuoy,
  Map,
  PenLine,
  Headphones,
  Wrench,
  UserRound,
} from 'lucide-react';

export type OperationalTag = 'Em breve' | 'Beta' | 'Novo';

export type WorkspaceNavItem = {
  label: string;
  icon: typeof Library;
  tag: OperationalTag | null;
  href?: string;
  children: { label: string; tag: OperationalTag | null; href?: string }[];
};

export const workNavigation: WorkspaceNavItem[] = [
  { label: 'Biblioteca', icon: Library, tag: null, href: '/library/all', children: [{ label: 'Todas as obras', tag: null, href: '/library/all' }, { label: 'Recentes', tag: null, href: '/library/recent' }, { label: 'Favoritas', tag: null, href: '/library/favorites' }, { label: 'Arquivadas', tag: null, href: '/library/archived' }, { label: 'Catálogos', tag: null, href: '/library/catalogs' }] },
  { label: 'Visão Geral', icon: BarChart3, tag: null, href: '/overview/dashboard', children: [{ label: 'Painel da obra', tag: null, href: '/overview/dashboard' }, { label: 'Atividade', tag: null, href: '/overview/activity' }, { label: 'Metas de escrita', tag: null, href: '/overview/goals' }] },
  { label: 'Ambiente de escrita', icon: PenLine, tag: null, href: '/write/editor', children: [{ label: 'Editor', tag: null, href: '/write/editor' }, { label: 'Capítulos', tag: null, href: '/write/chapters' }, { label: 'Cenas', tag: null, href: '/write/scenes' }, { label: 'Notas', tag: null, href: '/write/notes' }, { label: 'Enciclopédia', tag: null, href: '/write/encyclopedia' }] },
  { label: 'Media & Sound', icon: Headphones, tag: 'Novo', href: '/write/editor?sound=open', children: [{ label: 'Sessões oficiais', tag: null, href: '/write/editor?sound=open' }, { label: 'Mixer da obra', tag: 'Beta', href: '/write/editor?sound=open' }] },
  { label: 'Ferramentas', icon: Wrench, tag: 'Novo', href: '/write/relations', children: [{ label: 'Relações', tag: 'Novo', href: '/write/relations' }, { label: 'Planejar', tag: 'Em breve' }, { label: 'Cronologia', tag: 'Em breve' }, { label: 'Pesquisa', tag: 'Em breve' }, { label: 'Analisar', tag: 'Em breve' }, { label: 'Revisar', tag: 'Em breve' }, { label: 'Exportar', tag: 'Em breve' }] },
];

export const footerNavigation = [
  { label: 'Configurações da conta', icon: UserRound, tag: null, href: '/account' },
];

export const contextOptions = [
  { label: 'Meu espaço', icon: Map },
  { label: 'Time editorial', icon: GitBranch },
  { label: 'Novo espaço', icon: LifeBuoy },
];
