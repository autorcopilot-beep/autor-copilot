'use server';

import { randomUUID } from 'node:crypto';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

const AVATAR_BUCKET = 'profile-avatars';
const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export type AvatarActionResult = {
  status: 'success' | 'error';
  message: string;
  signedUrl?: string;
};

async function authenticatedClient() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  return userId ? { supabase, userId } : null;
}

export async function uploadProfileAvatar(formData: FormData): Promise<AvatarActionResult> {
  const authentication = await authenticatedClient();
  if (!authentication) return { status: 'error', message: 'Sua sessão expirou. Entre novamente.' };

  const file = formData.get('avatar');
  if (!(file instanceof File)) return { status: 'error', message: 'Selecione uma imagem válida.' };
  if (!ALLOWED_TYPES.has(file.type)) return { status: 'error', message: 'Use uma imagem JPG, PNG ou WebP.' };
  if (file.size <= 0 || file.size > MAX_AVATAR_SIZE) return { status: 'error', message: 'A imagem final deve ter no máximo 2 MB.' };

  const { supabase, userId } = authentication;
  const { data: currentProfile, error: profileReadError } = await supabase.from('profiles').select('avatar_path').eq('id', userId).single();
  if (profileReadError) return { status: 'error', message: 'O armazenamento de fotos ainda não foi configurado no Supabase.' };
  const extension = file.type === 'image/png' ? 'png' : file.type === 'image/jpeg' ? 'jpg' : 'webp';
  const avatarPath = `${userId}/avatar-${Date.now()}-${randomUUID()}.${extension}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(avatarPath, bytes, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) return { status: 'error', message: 'Não foi possível enviar a imagem. Tente novamente.' };

  const { error: profileError } = await supabase.from('profiles').update({ avatar_path: avatarPath }).eq('id', userId).select('id').single();
  if (profileError) {
    await supabase.storage.from(AVATAR_BUCKET).remove([avatarPath]);
    return { status: 'error', message: 'A imagem foi enviada, mas não pôde ser associada ao perfil.' };
  }

  if (currentProfile?.avatar_path && currentProfile.avatar_path !== avatarPath) {
    await supabase.storage.from(AVATAR_BUCKET).remove([currentProfile.avatar_path]);
  }

  const { data: signedData } = await supabase.storage.from(AVATAR_BUCKET).createSignedUrl(avatarPath, 60 * 60);
  revalidatePath('/account', 'layout');
  revalidatePath('/dashboard');
  return { status: 'success', message: 'Foto do perfil atualizada.', signedUrl: signedData?.signedUrl };
}

export async function removeProfileAvatar(): Promise<AvatarActionResult> {
  const authentication = await authenticatedClient();
  if (!authentication) return { status: 'error', message: 'Sua sessão expirou. Entre novamente.' };

  const { supabase, userId } = authentication;
  const { data: profile } = await supabase.from('profiles').select('avatar_path').eq('id', userId).single();
  if (!profile?.avatar_path) return { status: 'success', message: 'A foto já foi removida.' };

  const { error } = await supabase.from('profiles').update({ avatar_path: null }).eq('id', userId).select('id').single();
  if (error) return { status: 'error', message: 'Não foi possível remover a foto agora.' };

  await supabase.storage.from(AVATAR_BUCKET).remove([profile.avatar_path]);
  revalidatePath('/account', 'layout');
  revalidatePath('/dashboard');
  return { status: 'success', message: 'Foto do perfil removida.' };
}
