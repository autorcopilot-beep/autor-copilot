'use server';

import { revalidatePath } from 'next/cache';

import { writeAdminAudit } from '@/features/admin/audit';
import { requireAdmin } from '@/features/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Json } from '@/types/database.generated';

function text(formData: FormData, key: string, max: number) { return String(formData.get(key) ?? '').trim().slice(0, max); }
function benefits(formData: FormData) { return text(formData, 'benefits', 4000).split('\n').map((item) => item.trim()).filter(Boolean).slice(0, 12); }
function archetypeValues(formData: FormData) {
  const code = text(formData, 'code_prefix', 8).toUpperCase();
  const color = text(formData, 'accent_color', 7);
  if (!/^[A-Z]{3,8}$/.test(code)) throw new Error('O prefixo deve ter de 3 a 8 letras maiúsculas.');
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) throw new Error('Informe uma cor hexadecimal válida.');
  const stageMin = Math.min(100, Math.max(0, Number(formData.get('stage_min') ?? 0)));
  const stageMax = Math.min(100, Math.max(stageMin, Number(formData.get('stage_max') ?? 100)));
  return { code_prefix: code, name: text(formData, 'name', 80), tagline: text(formData, 'tagline', 180), description: text(formData, 'description', 2000), advancement_text: text(formData, 'advancement_text', 1000), benefits: benefits(formData), accent_color: color, image_url: text(formData, 'image_url', 2000), asset_key: text(formData, 'asset_key', 120), stage_min: stageMin, stage_max: stageMax, sort_order: Number(formData.get('sort_order') ?? 100), is_active: formData.get('is_active') === 'on' };
}

export async function createAuthorArchetype(formData: FormData) {
  const actor = await requireAdmin('features.manage');
  const values = archetypeValues(formData);
  if (!values.name) throw new Error('O nome do arquétipo é obrigatório.');
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('author_archetypes').insert(values).select('id').single();
  if (error) throw new Error(error.message);
  await writeAdminAudit({ actor, action: 'author_archetype.created', targetType: 'author_archetype', targetId: data.id, newData: values as unknown as Json });
  revalidatePath('/admin/author-profiles');
}

export async function updateAuthorArchetype(formData: FormData) {
  const actor = await requireAdmin('features.manage');
  const id = text(formData, 'id', 36);
  const values = archetypeValues(formData);
  const supabase = createAdminClient();
  const { data: previous } = await supabase.from('author_archetypes').select('*').eq('id', id).maybeSingle();
  const { error } = await supabase.from('author_archetypes').update(values).eq('id', id);
  if (error) throw new Error(error.message);
  await writeAdminAudit({ actor, action: 'author_archetype.updated', targetType: 'author_archetype', targetId: id, oldData: previous as unknown as Json, newData: values as unknown as Json });
  revalidatePath('/admin/author-profiles');
  revalidatePath('/account');
}
