import nextEnv from '@next/env';
import { createClient } from '@supabase/supabase-js';

nextEnv.loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.MASTER_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.MASTER_ADMIN_PASSWORD;
const displayName = process.env.MASTER_ADMIN_NAME?.trim() || 'Master Admin';

if (!url || !secretKey || !email || !password) {
  throw new Error(
    'Defina NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, MASTER_ADMIN_EMAIL e MASTER_ADMIN_PASSWORD.',
  );
}

if (password.length < 12) {
  throw new Error('MASTER_ADMIN_PASSWORD deve ter pelo menos 12 caracteres.');
}

const supabase = createClient(url, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: usersPage, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (listError) throw listError;

let user = usersPage.users.find((candidate) => candidate.email?.toLowerCase() === email);
let createdNow = false;

if (!user) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { admin_role: 'master', is_master: true },
    user_metadata: { display_name: displayName },
  });
  if (error || !data.user) throw error ?? new Error('O Supabase não retornou o usuário criado.');
  user = data.user;
  createdNow = true;
} else {
  const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
    password,
    email_confirm: true,
    app_metadata: { ...user.app_metadata, admin_role: 'master', is_master: true },
    user_metadata: { ...user.user_metadata, display_name: displayName },
  });
  if (error || !data.user) throw error ?? new Error('Não foi possível promover a conta existente.');
  user = data.user;
}

const { data: previousAccount, error: previousAccountError } = await supabase
  .from('admin_accounts')
  .select('*')
  .eq('user_id', user.id)
  .maybeSingle();
if (previousAccountError) throw previousAccountError;

const masterAccount = {
  user_id: user.id,
  display_name: displayName,
  email,
  role: 'master',
  is_master: true,
  status: 'active',
  created_by: user.id,
};
const { error: accountError } = await supabase.from('admin_accounts').upsert(masterAccount);

if (accountError) {
  if (createdNow) await supabase.auth.admin.deleteUser(user.id);
  throw accountError;
}

const { error: auditError } = await supabase.from('admin_audit_logs').insert({
  actor_id: user.id,
  actor_role: 'master',
  action: createdNow ? 'admin.master.bootstrap.created' : 'admin.master.bootstrap.reconciled',
  target_type: 'admin_account',
  target_id: user.id,
  new_data: { display_name: displayName, email, role: 'master', status: 'active' },
  metadata: { source: 'isolated_seeder' },
});

if (auditError) {
  if (createdNow) {
    await supabase.auth.admin.deleteUser(user.id);
  } else if (previousAccount) {
    await supabase.from('admin_accounts').upsert(previousAccount);
  } else {
    await supabase.from('admin_accounts').delete().eq('user_id', user.id);
  }
  throw auditError;
}

console.log(`Master Admin preparado: ${email} (${user.id})`);
