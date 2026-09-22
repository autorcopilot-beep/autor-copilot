'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

export async function adminLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: 'local' });
  redirect('/admin/login?status=signed-out');
}
