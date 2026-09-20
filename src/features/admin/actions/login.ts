'use server';

import { redirect } from 'next/navigation';

import { loginSchema, type LoginState } from '@/features/auth/schemas/login';
import { createClient } from '@/lib/supabase/server';

export async function adminLogin(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revise os campos destacados.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      email: String(formData.get('email') ?? ''),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    return { status: 'error', message: 'Credenciais administrativas inválidas.', email: parsed.data.email };
  }

  const { data: account } = await supabase
    .from('admin_accounts')
    .select('status')
    .eq('user_id', data.user.id)
    .maybeSingle();

  if (!account || account.status !== 'active') {
    await supabase.auth.signOut({ scope: 'local' });
    return { status: 'error', message: 'Esta conta não possui acesso administrativo.', email: parsed.data.email };
  }

  redirect('/admin');
}
