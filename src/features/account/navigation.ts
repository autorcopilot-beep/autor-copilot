import {
  Bell,
  Bot,
  Brush,
  CreditCard,
  Database,
  FileKey,
  Gauge,
  KeyRound,
  Link2,
  LogIn,
  MessagesSquare,
  PenLine,
  Shield,
  Smartphone,
  TriangleAlert,
  UserRound,
  Users,
} from 'lucide-react';

export type AccountSectionStatus = 'available' | 'coming_soon' | 'beta' | 'new' | 'disabled';

export type AccountSection = {
  slug: string;
  href: string;
  label: string;
  description: string;
  icon: typeof Gauge;
  status: AccountSectionStatus;
};

export const accountSections: AccountSection[] = [
  { slug: 'overview', href: '/account', label: 'Visão geral', description: 'Resumo da conta e acessos rápidos.', icon: Gauge, status: 'available' },
  { slug: 'profile', href: '/account/profile', label: 'Perfil', description: 'Identidade e preferências editoriais.', icon: UserRound, status: 'available' },
  { slug: 'login', href: '/account/login', label: 'Login e e-mail', description: 'Endereço de acesso e confirmações.', icon: LogIn, status: 'available' },
  { slug: 'security', href: '/account/security', label: 'Senha e segurança', description: 'Senha, MFA e eventos de segurança.', icon: KeyRound, status: 'coming_soon' },
  { slug: 'sessions', href: '/account/sessions', label: 'Sessões e dispositivos', description: 'Dispositivos e acessos ativos.', icon: Smartphone, status: 'coming_soon' },
  { slug: 'writing', href: '/account/writing', label: 'Preferências de escrita', description: 'Metas e comportamento do editor.', icon: PenLine, status: 'coming_soon' },
  { slug: 'appearance', href: '/account/appearance', label: 'Aparência e acessibilidade', description: 'Tema, leitura e movimento.', icon: Brush, status: 'coming_soon' },
  { slug: 'notifications', href: '/account/notifications', label: 'Notificações', description: 'Alertas, lembretes e menções.', icon: Bell, status: 'coming_soon' },
  { slug: 'communications', href: '/account/communications', label: 'Comunicações', description: 'Consentimentos e novidades.', icon: MessagesSquare, status: 'coming_soon' },
  { slug: 'privacy', href: '/account/privacy', label: 'Privacidade e dados', description: 'LGPD, exportação e visibilidade.', icon: Shield, status: 'coming_soon' },
  { slug: 'ai', href: '/account/ai', label: 'Autor Copilot IA', description: 'Assistência e memória da IA.', icon: Bot, status: 'coming_soon' },
  { slug: 'usage', href: '/account/usage', label: 'Plano, créditos e uso', description: 'Plano, consumo e cobranças.', icon: CreditCard, status: 'coming_soon' },
  { slug: 'storage', href: '/account/storage', label: 'Armazenamento', description: 'Arquivos, limites e lixeira.', icon: Database, status: 'coming_soon' },
  { slug: 'integrations', href: '/account/integrations', label: 'Integrações', description: 'Serviços e conexões externas.', icon: Link2, status: 'coming_soon' },
  { slug: 'collaboration', href: '/account/collaboration', label: 'Espaços colaborativos', description: 'Papéis, convites e equipes.', icon: Users, status: 'coming_soon' },
  { slug: 'team', href: '/account/team', label: 'Conta de equipe', description: 'Membros e limites compartilhados.', icon: FileKey, status: 'coming_soon' },
  { slug: 'danger', href: '/account/danger', label: 'Zona de risco', description: 'Desativação e exclusão da conta.', icon: TriangleAlert, status: 'coming_soon' },
];

export function getAccountSection(slug: string) {
  return accountSections.find((section) => section.slug === slug);
}
