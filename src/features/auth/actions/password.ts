'use server';

import { redirect } from 'next/navigation';

import { getSiteUrl } from '@/config/env';
import {
  forgotPasswordSchema,
  updatePasswordSchema,
  type ForgotPasswordState,
  type UpdatePasswordState,
} from '@/features/auth/schemas/password';
import { createClient } from '@/lib/supabase/server';

export async function requestPasswordReset(
  _previousState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get('email') });

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revise o e-mail informado.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      email: String(formData.get('email') ?? ''),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/update-password`,
  });

  if (error?.status === 429) {
    return {
      status: 'error',
      message: 'Muitas solicitações em pouco tempo. Aguarde alguns minutos.',
      email: parsed.data.email,
    };
  }

  if (error) {
    return {
      status: 'error',
      message: 'Não foi possível enviar o e-mail agora. Tente novamente mais tarde.',
      email: parsed.data.email,
    };
  }

  return {
    status: 'success',
    message: 'Se existir uma conta com esse e-mail, enviaremos um link para criar uma nova senha.',
    email: parsed.data.email,
  };
}

export async function updatePassword(
  _previousState: UpdatePasswordState,
  formData: FormData,
): Promise<UpdatePasswordState> {
  const parsed = updatePasswordSchema.safeParse({
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
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims?.sub) {
    return {
      status: 'error',
      message: 'Este link expirou. Solicite uma nova recuperação de senha.',
    };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return {
      status: 'error',
      message: 'Não foi possível atualizar a senha. Solicite um novo link e tente novamente.',
    };
  }

  await supabase.auth.signOut({ scope: 'global' });
  redirect('/login?status=password-updated');
}
