'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  identityProfileSchema,
  regionProfileSchema,
  type AccountProfileState,
  writingProfileSchema,
} from '@/features/account/schemas/profile';
import { createClient } from '@/lib/supabase/server';

async function getAuthenticatedProfileClient() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect('/login?next=/account/profile');
  return { supabase, userId };
}

function refreshProfile(savedSection: 'identity' | 'writing' | 'region'): never {
  revalidatePath('/account', 'layout');
  revalidatePath('/dashboard');
  redirect(`/account/profile?saved=${savedSection}`);
}

export async function updateIdentityProfile(_previousState: AccountProfileState, formData: FormData): Promise<AccountProfileState> {
  const parsed = identityProfileSchema.safeParse({
    fullName: formData.get('fullName'),
    nickname: formData.get('nickname'),
    username: formData.get('username'),
    penName: formData.get('penName'),
    age: formData.get('age'),
    bio: formData.get('bio'),
  });
  if (!parsed.success) return { status: 'error', message: 'Revise os campos destacados.', fieldErrors: parsed.error.flatten().fieldErrors };

  const { supabase, userId } = await getAuthenticatedProfileClient();
  const { error } = await supabase.from('profiles').update({
    full_name: parsed.data.fullName,
    nickname: parsed.data.nickname,
    username: parsed.data.username,
    display_name: parsed.data.nickname,
    pen_name: parsed.data.penName || null,
    age: parsed.data.age,
    bio: parsed.data.bio || null,
  }).eq('id', userId).select('id').single();

  if (error?.code === '23505') return { status: 'error', message: 'Este nome de usuário já está em uso.', fieldErrors: { username: ['Escolha outro nome de usuário.'] } };
  if (error) return { status: 'error', message: 'Não foi possível salvar esta seção agora. Tente novamente.' };
  refreshProfile('identity');
}

export async function updateWritingProfile(_previousState: AccountProfileState, formData: FormData): Promise<AccountProfileState> {
  const parsed = writingProfileSchema.safeParse({
    writingFocus: formData.get('writingFocus'),
    experienceLevel: formData.get('experienceLevel'),
    genres: formData.getAll('genres'),
  });
  if (!parsed.success) return { status: 'error', message: 'Revise os campos destacados.', fieldErrors: parsed.error.flatten().fieldErrors };

  const { supabase, userId } = await getAuthenticatedProfileClient();
  const { error } = await supabase.from('profiles').update({
    writing_focus: parsed.data.writingFocus,
    experience_level: parsed.data.experienceLevel,
    writing_genres: parsed.data.genres,
  }).eq('id', userId).select('id').single();

  if (error) return { status: 'error', message: 'Não foi possível salvar esta seção agora. Tente novamente.' };
  refreshProfile('writing');
}

export async function updateRegionProfile(_previousState: AccountProfileState, formData: FormData): Promise<AccountProfileState> {
  const parsed = regionProfileSchema.safeParse({
    locale: formData.get('locale'),
    countryCode: formData.get('countryCode') === 'unset' ? '' : formData.get('countryCode'),
    timezone: formData.get('timezone'),
  });
  if (!parsed.success) return { status: 'error', message: 'Revise os campos destacados.', fieldErrors: parsed.error.flatten().fieldErrors };

  const { supabase, userId } = await getAuthenticatedProfileClient();
  const { error } = await supabase.from('profiles').update({
    locale: parsed.data.locale,
    country_code: parsed.data.countryCode || null,
    timezone: parsed.data.timezone,
  }).eq('id', userId).select('id').single();

  if (error) return { status: 'error', message: 'Não foi possível salvar esta seção agora. Tente novamente.' };
  refreshProfile('region');
}
