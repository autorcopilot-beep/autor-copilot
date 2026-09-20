import 'server-only';

import { redirect } from 'next/navigation';

import { hasAdminPermission, isAdminRole, type AdminPermission, type AdminRole } from '@/features/admin/rbac';
import { createClient } from '@/lib/supabase/server';

export type AdminContext = {
  userId: string;
  email?: string;
  displayName: string;
  role: AdminRole;
  isMaster: boolean;
};

export async function getAdminContext(): Promise<AdminContext | null> {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) return null;

  const { data: account } = await supabase
    .from('admin_accounts')
    .select('display_name, role, is_master, status')
    .eq('user_id', userId)
    .maybeSingle();

  if (!account || account.status !== 'active' || !isAdminRole(account.role)) return null;

  return {
    userId,
    email: typeof claimsData.claims.email === 'string' ? claimsData.claims.email : undefined,
    displayName: account.display_name,
    role: account.role,
    isMaster: account.is_master,
  };
}

export async function requireAdmin(permission?: AdminPermission): Promise<AdminContext> {
  const context = await getAdminContext();
  if (!context) redirect('/admin/login?error=unauthorized');
  if (permission && !hasAdminPermission(context.role, permission)) redirect('/admin?error=forbidden');
  return context;
}
