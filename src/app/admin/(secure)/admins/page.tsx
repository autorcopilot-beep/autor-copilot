import { Plus } from 'lucide-react';
import Link from 'next/link';

import { requireAdmin } from '@/features/admin/auth';
import { AdminAccountsTable, type AdminAccountRow } from '@/features/admin/components/admin-accounts-table';
import { hasAdminPermission } from '@/features/admin/rbac';
import { createClient } from '@/lib/supabase/server';

export default async function AdminsPage() {
  const admin = await requireAdmin('admins.read');
  const supabase = await createClient();
  const { data: accounts } = await supabase.from('admin_accounts').select('user_id, display_name, email, role, is_master, status, created_at').order('created_at');

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div><p className="text-xs uppercase tracking-[0.2em] text-accent">Identidade e acesso</p><h1 className="mt-2 text-3xl font-semibold">Administradores</h1></div>
        {admin.isMaster && hasAdminPermission(admin.role, 'admins.manage') && <Link href="/admin/admins/new" className="inline-flex min-h-11 items-center gap-2 rounded-control border border-accent bg-accent text-on-accent px-4 text-sm font-medium text-on-accent hover:bg-accent-hover"><Plus className="size-4" />Novo administrador</Link>}
      </div>
      <div className="mt-7"><AdminAccountsTable accounts={(accounts ?? []) as AdminAccountRow[]} /></div>
    </div>
  );
}
