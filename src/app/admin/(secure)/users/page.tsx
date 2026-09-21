import { Save, UserRound } from 'lucide-react';

import { updateUserAccess } from '@/features/admin/actions/product-controls';
import { requireAdmin } from '@/features/admin/auth';
import { hasAdminPermission } from '@/features/admin/rbac';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function AdminUsersPage() {
  const admin = await requireAdmin('users.read');
  const supabase = createAdminClient();
  const [{ data: usersData, error: usersError }, { data: profiles }, { data: accessProfiles, error: accessError }] = await Promise.all([
    supabase.auth.admin.listUsers({ page: 1, perPage: 200 }),
    supabase.from('profiles').select('id, display_name, username, writing_focus, created_at').order('created_at', { ascending: false }),
    supabase.from('user_access_profiles').select('*'),
  ]);
  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
  const accessMap = new Map((accessProfiles ?? []).map((access) => [access.user_id, access]));
  const canManage = hasAdminPermission(admin.role, 'users.suspend');
  return <div><p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Clientes e acesso</p><h1 className="mt-2 text-3xl font-semibold">Usuários</h1><p className="mt-3 max-w-3xl text-sm text-white/50">Consulte identidades e controle status, grupos de liberação e tags operacionais.</p>{usersError ? <p className="mt-7 text-red-200">{usersError.message}</p> : <div className="mt-7 space-y-3">{usersData.users.map((user) => { const profile = profileMap.get(user.id); const access = accessMap.get(user.id); return <form key={user.id} action={updateUserAccess} className="rounded-card border border-white/10 bg-white/[0.035] p-5"><input type="hidden" name="user_id" value={user.id} /><div className="grid gap-4 lg:grid-cols-[minmax(14rem,1.3fr)_10rem_1fr_1fr_auto]"><div className="flex min-w-0 items-start gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300"><UserRound className="size-4" /></span><div className="min-w-0"><p className="truncate font-medium">{profile?.display_name ?? user.email ?? 'Usuário'}</p><p className="truncate text-xs text-white/40">{user.email}</p><p className="mt-1 text-[10px] text-white/30">@{profile?.username ?? 'sem-username'} · {user.id.slice(0, 8)}</p></div></div><label className="text-xs text-white/55">Status<select name="status" defaultValue={access?.status ?? 'active'} disabled={!canManage} className="mt-1.5 min-h-10 w-full rounded-control border border-white/10 bg-black/25 px-3 text-white"><option value="active">Ativo</option><option value="restricted">Restrito</option><option value="suspended">Suspenso</option></select></label><label className="text-xs text-white/55">Grupos<input name="groups" defaultValue={(access?.groups ?? ['free']).join(', ')} disabled={!canManage} className="mt-1.5 min-h-10 w-full rounded-control border border-white/10 bg-black/25 px-3 text-white" /></label><label className="text-xs text-white/55">Tags<input name="tags" defaultValue={(access?.tags ?? []).join(', ')} disabled={!canManage} className="mt-1.5 min-h-10 w-full rounded-control border border-white/10 bg-black/25 px-3 text-white" /></label>{canManage && <button className="mt-[1.35rem] inline-flex size-10 items-center justify-center rounded-control bg-emerald-600 hover:bg-emerald-500" aria-label={`Salvar acesso de ${user.email}`}><Save className="size-4" /></button>}</div><label className="mt-3 block text-xs text-white/45">Nota interna<input name="notes" defaultValue={access?.notes ?? ''} disabled={!canManage} className="mt-1.5 min-h-9 w-full rounded-control border border-white/10 bg-black/20 px-3 text-white" /></label></form>; })}</div>}{accessError && <p className="mt-4 text-xs text-amber-200">Perfis de acesso indisponíveis até aplicar a migration: {accessError.message}</p>}</div>;
}
