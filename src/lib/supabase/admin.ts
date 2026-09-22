import 'server-only';

import { createClient } from '@supabase/supabase-js';

import { getSupabaseEnv } from '@/config/env';
import type { Database } from '@/types/database.generated';

export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secretKey) {
    throw new Error(
      'SUPABASE_SECRET_KEY ausente. Configure a chave secreta somente no ambiente do servidor.',
    );
  }

  return createClient<Database>(getSupabaseEnv().url, secretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
