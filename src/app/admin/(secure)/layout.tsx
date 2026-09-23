import { requireAdmin } from '@/features/admin/auth';
import type { AdminCommand } from '@/features/admin/components/admin-command-palette';
import { AdminShell, type AdminNavItem } from '@/features/admin/components/admin-shell';
import { adminRoleLabels, hasAdminPermission } from '@/features/admin/rbac';

export default async function AdminSecureLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const environment = process.env.VERCEL_ENV ?? (process.env.NODE_ENV === 'production' ? 'production' : 'local');
  const commands: AdminCommand[] = [
    { href: '/admin', label: 'Visão geral', keywords: 'dashboard início métricas', icon: 'dashboard' },
    ...(hasAdminPermission(admin.role, 'communications.read') ? [{ href: '/admin/publish', label: 'OmniPublish', keywords: 'campanhas comunicação email changelog blog alertas status', icon: 'publish' as const }] : []),
    ...(hasAdminPermission(admin.role, 'api.read') ? [{ href: '/admin/apis', label: 'APIs', keywords: 'fastapi integrações chaves openapi swagger endpoints', icon: 'api' as const }] : []),
    ...(hasAdminPermission(admin.role, 'admins.read') ? [{ href: '/admin/admins', label: 'Administradores', keywords: 'identidade acesso rbac equipe', icon: 'admins' as const }] : []),
    ...(hasAdminPermission(admin.role, 'admins.manage') ? [{ href: '/admin/admins/new', label: 'Criar administrador', keywords: 'novo convite conta papel', icon: 'new-admin' as const }] : []),
    ...(hasAdminPermission(admin.role, 'users.read') ? [{ href: '/admin/users', label: 'Usuários', keywords: 'clientes grupos tags suspensão', icon: 'users' as const }] : []),
    ...(hasAdminPermission(admin.role, 'features.read') ? [{ href: '/admin/extensions', label: 'Extensões', keywords: 'marketplace preço grupos catálogo', icon: 'extensions' as const }, { href: '/admin/sound', label: 'Media & Sound', keywords: 'áudio biblioteca faixas audiolivro mixer', icon: 'sound' as const }, { href: '/admin/flags', label: 'Flags e tags', keywords: 'rollout feature liberação segmentos', icon: 'flags' as const }] : []),
    ...(hasAdminPermission(admin.role, 'guidance.read') ? [{ href: '/admin/guidance', label: 'Guias do produto', keywords: 'tour onboarding coach marks walkthrough tooltip hotspots', icon: 'guidance' as const }] : []),
    ...(hasAdminPermission(admin.role, 'features.read') ? [{ href: '/admin/author-profiles', label: 'Perfis de autor', keywords: 'arquétipos estágios benefícios comportamento churn', icon: 'archetypes' as const }] : []),
    ...(hasAdminPermission(admin.role, 'legal.read') ? [{ href: '/admin/legal', label: 'Termos legais', keywords: 'jurídico documentos versões publicação', icon: 'legal' as const }] : []),
    ...(hasAdminPermission(admin.role, 'audit.read') ? [{ href: '/admin/audit', label: 'Trilha de auditoria', keywords: 'logs eventos segurança', icon: 'audit' as const }] : []),
  ];
  const navigation: AdminNavItem[] = commands
    .filter((command) => command.href !== '/admin/admins/new')
    .map((command) => ({
      href: command.href,
      label: command.label,
      icon: command.icon,
      description: command.icon === 'dashboard' ? 'Resumo da operação' : command.icon === 'publish' ? 'Comunicação multicanal' : command.icon === 'api' ? 'FastAPI, chaves e OpenAPI' : command.icon === 'users' ? 'Contas, grupos e acesso' : command.icon === 'extensions' ? 'Catálogo e licenças' : command.icon === 'sound' ? 'Biblioteca de áudio' : command.icon === 'flags' ? 'Rollouts e segmentos' : command.icon === 'guidance' ? 'Tours, dicas e hotspots' : command.icon === 'archetypes' ? 'Arquétipos e estágios' : command.icon === 'legal' ? 'Documentos e versões' : command.icon === 'admins' ? 'Equipe e permissões' : 'Eventos e segurança',
    }));

  return (
    <AdminShell displayName={admin.displayName} roleLabel={adminRoleLabels[admin.role]} environment={environment} commands={commands} navigation={navigation}>{children}</AdminShell>
  );
}
