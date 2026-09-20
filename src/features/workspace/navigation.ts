import {
  BarChart3,
  BookOpen,
  Bot,
  BrainCircuit,
  CircleHelp,
  Coins,
  Download,
  FileSearch,
  FlaskConical,
  FolderKanban,
  GitBranch,
  Library,
  LifeBuoy,
  Map,
  MessagesSquare,
  Network,
  PenLine,
  ScrollText,
  Sparkles,
  Timer,
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
  { label: 'Biblioteca', icon: Library, tag: 'Em breve', children: [{ label: 'Todas as obras', tag: 'Em breve' }, { label: 'Recentes', tag: 'Em breve' }, { label: 'Favoritas', tag: 'Em breve' }, { label: 'Arquivadas', tag: 'Em breve' }] },
  { label: 'Visão Geral', icon: BarChart3, tag: 'Em breve', children: [{ label: 'Painel da obra', tag: 'Em breve' }, { label: 'Atividade', tag: 'Em breve' }, { label: 'Metas de escrita', tag: 'Em breve' }] },
  { label: 'Escrever', icon: PenLine, tag: 'Beta', href: '/write/editor', children: [{ label: 'Editor', tag: 'Beta', href: '/write/editor' }, { label: 'Capítulos', tag: 'Beta', href: '/write/chapters' }, { label: 'Cenas', tag: 'Beta', href: '/write/scenes' }, { label: 'Notas', tag: 'Beta', href: '/write/notes' }] },
  { label: 'Planejar', icon: FolderKanban, tag: 'Em breve', children: [{ label: 'Estrutura', tag: 'Em breve' }, { label: 'Enredo', tag: 'Em breve' }, { label: 'Personagens', tag: 'Em breve' }, { label: 'Cenários', tag: 'Em breve' }] },
  { label: 'Enciclopédia', icon: BookOpen, tag: 'Em breve', children: [{ label: 'Mundo', tag: 'Em breve' }, { label: 'Personagens', tag: 'Em breve' }, { label: 'Locais', tag: 'Em breve' }, { label: 'Objetos', tag: 'Em breve' }] },
  { label: 'Cronologia', icon: Timer, tag: 'Em breve', children: [{ label: 'Linha do tempo', tag: 'Em breve' }, { label: 'Eventos', tag: 'Em breve' }, { label: 'Calendários', tag: 'Em breve' }] },
  { label: 'Relações', icon: Network, tag: 'Em breve', children: [{ label: 'Mapa de relações', tag: 'Em breve' }, { label: 'Núcleos', tag: 'Em breve' }, { label: 'Conflitos', tag: 'Em breve' }] },
  { label: 'Pesquisa', icon: FileSearch, tag: 'Em breve', children: [{ label: 'Referências', tag: 'Em breve' }, { label: 'Fontes', tag: 'Em breve' }, { label: 'Arquivos', tag: 'Em breve' }] },
  { label: 'Analisar', icon: Sparkles, tag: 'Em breve', children: [{ label: 'Métricas', tag: 'Em breve' }, { label: 'Ritmo', tag: 'Em breve' }, { label: 'Continuidade', tag: 'Em breve' }, { label: 'Consistência', tag: 'Em breve' }] },
  { label: 'Revisar', icon: ScrollText, tag: 'Em breve', children: [{ label: 'Ortografia', tag: 'Em breve' }, { label: 'Estilo', tag: 'Em breve' }, { label: 'Comentários', tag: 'Em breve' }, { label: 'Versões', tag: 'Em breve' }] },
  { label: 'Exportar', icon: Download, tag: 'Em breve', children: [{ label: 'PDF', tag: 'Em breve' }, { label: 'DOCX', tag: 'Em breve' }, { label: 'EPUB', tag: 'Em breve' }, { label: 'Impressão', tag: 'Em breve' }] },
];

export const platformNavigation = [
  { label: 'Playground', icon: FlaskConical, tag: 'Em breve' as const },
  { label: 'Documentação', icon: ScrollText, tag: 'Em breve' as const },
  { label: 'Comunidade', icon: MessagesSquare, tag: 'Em breve' as const },
  { label: 'Ajuda', icon: CircleHelp, tag: 'Em breve' as const },
];

export const footerNavigation = [
  { label: 'Autor Copilot IA', icon: Bot, tag: 'Em breve' as const },
  { label: 'Créditos e uso', icon: Coins, tag: 'Em breve' as const },
  { label: 'Memória e armazenamento', icon: BrainCircuit, tag: 'Em breve' as const },
  { label: 'Configurações da conta', icon: UserRound, tag: null, href: '/account' },
];

export const contextOptions = [
  { label: 'Meu espaço', icon: Map },
  { label: 'Time editorial', icon: GitBranch },
  { label: 'Novo espaço', icon: LifeBuoy },
];
