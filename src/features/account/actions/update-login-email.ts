'use server';

import { redirect } from 'next/navigation';

import { loginEmailSchema, type LoginEmailState } from '@/features/account/schemas/login-email';
import { getSiteUrl } from '@/config/env';
import { createClient } from '@/lib/supabase/server';

export async function updateLoginEmail(_previousState: LoginEmailState, formData: FormData): Promise<LoginEmailState> {
  const parsed = loginEmailSchema.safeParse({ email: formData.get('email') });
  if (!parsed.success) return { status: 'error', message: 'Revise o endereço informado.', fieldErrors: parsed.error.flatten().fieldErrors };

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const currentEmail = typeof claimsData?.claims?.email === 'string' ? claimsData.claims.email.toLowerCase() : undefined;
  if (!claimsData?.claims?.sub) redirect('/login?next=/account/login');
  if (currentEmail === parsed.data.email) return { status: 'error', message: 'Este já é o e-mail usado para entrar na sua conta.', fieldErrors: { email: ['Informe um endereço diferente.'] } };

  const { error } = await supabase.auth.updateUser(
    { email: parsed.data.email },
    { emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/account/login` },
  );

  if (error) {
    const message = error.code === 'over_email_send_rate_limit'
      ? 'Aguarde alguns minutos antes de solicitar outro e-mail.'
      : 'Não foi possível solicitar a alteração agora. Tente novamente.';
    return { status: 'error', message };
  }

  redirect('/account/login?email=requested');
}
