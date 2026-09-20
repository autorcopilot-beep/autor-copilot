'use server';

import { redirect } from 'next/navigation';

import {
  onboardingSchema,
  type OnboardingState,
} from '@/features/onboarding/schemas/profile';
import { createClient } from '@/lib/supabase/server';

export async function completeProfile(
  _previousState: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const parsed = onboardingSchema.safeParse({
    penName: formData.get('penName'),
    writingFocus: formData.get('writingFocus'),
    experienceLevel: formData.get('experienceLevel'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Complete as escolhas destacadas.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) redirect('/login?next=/onboarding');

  const { error } = await supabase
    .from('profiles')
    .update({
      pen_name: parsed.data.penName || null,
      writing_focus: parsed.data.writingFocus,
      experience_level: parsed.data.experienceLevel,
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select('id')
    .single();

  if (error) {
    return {
      status: 'error',
      message: 'Não foi possível salvar seu perfil agora. Tente novamente.',
    };
  }

  redirect('/dashboard?status=ready');
}
