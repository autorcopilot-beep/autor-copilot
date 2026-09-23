import { Brush, CreditCard, Gauge, KeyRound, LogIn, Puzzle, TriangleAlert, UserRound } from 'lucide-react';

export type AccountSectionStatus = 'available' | 'coming_soon' | 'beta' | 'new' | 'disabled';
export type AccountSection = { slug: string; href: string; label: string; description: string; icon: typeof Gauge; status: AccountSectionStatus };

export const accountSections: AccountSection[] = [
  { slug: 'overview', href: '/account', label: 'Visão geral', description: 'Resumo, estágio e acessos rápidos.', icon: Gauge, status: 'available' },
  { slug: 'profile', href: '/account/profile', label: 'Perfil', description: 'Identidade e presença editorial.', icon: UserRound, status: 'available' },
  { slug: 'preferences', href: '/account/preferences', label: 'Preferências', description: 'Escrita, aparência, privacidade e IA.', icon: Brush, status: 'available' },
  { slug: 'extensions', href: '/account/extensions', label: 'Extensões', description: 'Recursos, plugins e conectores.', icon: Puzzle, status: 'available' },
  { slug: 'login', href: '/account/login', label: 'Login e e-mail', description: 'Endereço de acesso e confirmações.', icon: LogIn, status: 'available' },
  { slug: 'security', href: '/account/security', label: 'Senha e segurança', description: 'Senha, MFA e eventos de segurança.', icon: KeyRound, status: 'coming_soon' },
  { slug: 'usage', href: '/account/usage', label: 'Plano e uso', description: 'Plano, consumo e cobranças.', icon: CreditCard, status: 'coming_soon' },
  { slug: 'danger', href: '/account/danger', label: 'Zona de risco', description: 'Desativação e exclusão da conta.', icon: TriangleAlert, status: 'coming_soon' },
];

export function getAccountSection(slug: string) { return accountSections.find((section) => section.slug === slug); }
