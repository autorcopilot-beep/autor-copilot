'use server';

import { redirect } from 'next/navigation';

import { getSiteUrl } from '@/config/env';
import { registerSchema, type RegisterState } from '@/features/auth/schemas/register';
import { createClient } from '@/lib/supabase/server';

export async function register(
  _previousState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    displayName: formData.get('displayName'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revise os campos destacados.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/onboarding`,
      data: { display_name: parsed.data.displayName },
    },
  });

  if (error) {
    return {
      status: 'error',
      message:
        error.status === 429
          ? 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.'
          : 'Não foi possível criar sua conta agora. Verifique os dados e tente novamente.',
    };
  }

  if (data.session) {
    redirect('/onboarding');
  }

  redirect(`/register/check-email?email=${encodeURIComponent(parsed.data.email)}`);
}
