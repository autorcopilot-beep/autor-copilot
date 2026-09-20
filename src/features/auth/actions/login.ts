'use server';

import { redirect } from 'next/navigation';

import { getSafeAuthDestination } from '@/features/auth/redirects';
import { loginSchema, type LoginState } from '@/features/auth/schemas/login';
import { createClient } from '@/lib/supabase/server';

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    next: formData.get('next') || undefined,
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
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      status: 'error',
      message:
        error.status === 429
          ? 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.'
          : 'E-mail ou senha incorretos. Confira os dados e tente novamente.',
      email: parsed.data.email,
    };
  }

  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    return {
      status: 'error',
      message: 'Não foi possível validar sua sessão. Tente entrar novamente.',
      email: parsed.data.email,
    };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed_at')
    .eq('id', userId)
    .maybeSingle();

  if (!profile?.onboarding_completed_at) {
    redirect('/onboarding');
  }

  redirect(getSafeAuthDestination(parsed.data.next, '/dashboard'));
}
