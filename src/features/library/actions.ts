'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import type { LibraryWorkStatus } from '@/features/library/types';
import { createClient } from '@/lib/supabase/server';

const tones = new Set(['sage', 'ink', 'clay', 'ochre', 'plum', 'ocean']);
const statuses = new Set<LibraryWorkStatus>(['planning', 'drafting', 'revising', 'complete']);

function value(formData: FormData, name: string, max: number) {
  return String(formData.get(name) ?? '').trim().slice(0, max);
}

function safeReturnTo(formData: FormData) {
  const destination = value(formData, 'returnTo', 300);
  return destination.startsWith('/library') && !destination.startsWith('//') ? destination : '/library/all';
}

async function authenticatedClient() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect('/login?next=/library/all');
  return { supabase, userId };
}

export async function createWork(formData: FormData) {
  const { supabase, userId } = await authenticatedClient();
  const title = value(formData, 'title', 200);
  if (!title) redirect('/library/all?error=title');
  const tone = value(formData, 'coverTone', 20);
  const status = value(formData, 'status', 20) as LibraryWorkStatus;
  const { data: primaryWork } = await supabase.from('works').select('id').eq('owner_id', userId).eq('is_primary', true).maybeSingle();
  const { data: work, error } = await supabase.from('works').insert({
    owner_id: userId,
    title,
    subtitle: value(formData, 'subtitle', 200),
    synopsis: value(formData, 'synopsis', 5000),
    genre: value(formData, 'genre', 80) || 'Não definido',
    status: statuses.has(status) ? status : 'drafting',
    cover_tone: tones.has(tone) ? tone : 'sage',
    is_primary: !primaryWork,
  }).select('id').single();
  if (error) throw new Error(`Não foi possível criar a obra (${error.code}).`, { cause: error });
  const { error: bootstrapError } = await supabase.rpc('ensure_initial_writing_documents', { target_work_id: work.id });
  if (bootstrapError) throw new Error(`A obra foi criada, mas o manuscrito não pôde ser preparado (${bootstrapError.code}).`, { cause: bootstrapError });
  revalidatePath('/library', 'layout');
  redirect(`/write/editor?work=${work.id}`);
}

export async function createCatalog(formData: FormData) {
  const { supabase, userId } = await authenticatedClient();
  const name = value(formData, 'name', 80);
  if (!name) redirect('/library/catalogs?error=name');
  const color = value(formData, 'color', 20);
  const { data: catalog, error } = await supabase.from('library_catalogs').insert({
    owner_id: userId,
    name,
    description: value(formData, 'description', 500),
    color: tones.has(color) ? color : 'sage',
  }).select('id').single();
  if (error) throw new Error(error.code === '23505' ? 'Já existe um catálogo com esse nome.' : `Não foi possível criar o catálogo (${error.code}).`, { cause: error });
  revalidatePath('/library', 'layout');
  redirect(`/library/catalogs/${catalog.id}`);
}

export async function toggleFavorite(formData: FormData) {
  const { supabase, userId } = await authenticatedClient();
  const workId = value(formData, 'workId', 36);
  const favorite = formData.get('favorite') === 'true';
  const { error } = await supabase.from('works').update({ is_favorite: favorite }).eq('id', workId).eq('owner_id', userId);
  if (error) throw new Error(`Não foi possível atualizar o favorito (${error.code}).`, { cause: error });
  revalidatePath('/library', 'layout');
  redirect(safeReturnTo(formData));
}

export async function setWorkStatus(formData: FormData) {
  const { supabase, userId } = await authenticatedClient();
  const status = value(formData, 'status', 20) as LibraryWorkStatus;
  if (!statuses.has(status)) return;
  const { error } = await supabase.from('works').update({ status }).eq('id', value(formData, 'workId', 36)).eq('owner_id', userId);
  if (error) throw new Error(`Não foi possível atualizar o estágio (${error.code}).`, { cause: error });
  revalidatePath('/library', 'layout');
  redirect(safeReturnTo(formData));
}

export async function setArchived(formData: FormData) {
  const { supabase, userId } = await authenticatedClient();
  const workId = value(formData, 'workId', 36);
  const archive = formData.get('archive') === 'true';
  const { data: work } = await supabase.from('works').select('is_primary').eq('id', workId).eq('owner_id', userId).single();
  if (archive && work?.is_primary) {
    const { data: replacement } = await supabase.from('works').select('id').eq('owner_id', userId).is('archived_at', null).neq('id', workId).order('updated_at', { ascending: false }).limit(1).maybeSingle();
    if (!replacement) redirect(`${safeReturnTo(formData)}?error=last-work`);
    await supabase.from('works').update({ is_primary: false }).eq('id', workId).eq('owner_id', userId);
    await supabase.from('works').update({ is_primary: true }).eq('id', replacement.id).eq('owner_id', userId);
  }
  const { error } = await supabase.from('works').update({ archived_at: archive ? new Date().toISOString() : null }).eq('id', workId).eq('owner_id', userId);
  if (error) throw new Error(`Não foi possível atualizar o arquivo (${error.code}).`, { cause: error });
  revalidatePath('/library', 'layout');
  redirect(safeReturnTo(formData));
}

export async function setCatalogMembership(formData: FormData) {
  const { supabase, userId } = await authenticatedClient();
  const catalogId = value(formData, 'catalogId', 36);
  const workId = value(formData, 'workId', 36);
  const add = formData.get('add') === 'true';
  const result = add
    ? await supabase.from('library_catalog_works').upsert({ catalog_id: catalogId, work_id: workId, owner_id: userId }, { onConflict: 'catalog_id,work_id' })
    : await supabase.from('library_catalog_works').delete().eq('catalog_id', catalogId).eq('work_id', workId).eq('owner_id', userId);
  if (result.error) throw new Error(`Não foi possível atualizar o catálogo (${result.error.code}).`, { cause: result.error });
  revalidatePath('/library', 'layout');
  redirect(safeReturnTo(formData));
}

export async function deleteCatalog(formData: FormData) {
  const { supabase, userId } = await authenticatedClient();
  const { error } = await supabase.from('library_catalogs').delete().eq('id', value(formData, 'catalogId', 36)).eq('owner_id', userId);
  if (error) throw new Error(`Não foi possível apagar o catálogo (${error.code}).`, { cause: error });
  revalidatePath('/library', 'layout');
  redirect('/library/catalogs');
}

