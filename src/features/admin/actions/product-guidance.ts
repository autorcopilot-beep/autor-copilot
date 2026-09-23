'use server';

import { revalidatePath } from 'next/cache';

import { writeAdminAudit } from '@/features/admin/audit';
import { requireAdmin } from '@/features/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Json } from '@/types/database.generated';

const experiences = new Set(['tour', 'coach_mark', 'walkthrough', 'tooltip_tour', 'hotspot']);
const placements = new Set(['top', 'right', 'bottom', 'left', 'center']);
const animations = new Set(['fade', 'slide', 'pulse', 'spotlight', 'none']);

function list(value: FormDataEntryValue | null) {
  return String(value ?? '').split(',').map((item) => item.trim()).filter(Boolean);
}

function text(formData: FormData, key: string, max = 2000) {
  return String(formData.get(key) ?? '').trim().slice(0, max);
}

function guideValues(formData: FormData, actorId: string) {
  const experience = text(formData, 'experience_type', 40);
  if (!experiences.has(experience)) throw new Error('Formato de orientação inválido.');
  const routePattern = text(formData, 'route_pattern', 240);
  if (!routePattern.startsWith('/')) throw new Error('A rota deve começar com /.');
  return {
    name: text(formData, 'name', 140),
    description: text(formData, 'description', 1000),
    experience_type: experience,
    route_pattern: routePattern,
    feature_key: text(formData, 'feature_key', 100),
    enabled: formData.get('enabled') === 'on',
    new_users_only: formData.get('new_users_only') === 'on',
    dismissible: formData.get('dismissible') === 'on',
    rollout_percentage: Math.min(100, Math.max(0, Number(formData.get('rollout_percentage') ?? 100))),
    priority: Math.min(10000, Math.max(0, Number(formData.get('priority') ?? 100))),
    allowed_groups: list(formData.get('allowed_groups')),
    allowed_tags: list(formData.get('allowed_tags')),
    settings: { maxAgeDays: Math.min(3650, Math.max(1, Number(formData.get('max_age_days') ?? 30))) },
    updated_by: actorId,
  };
}

function stepValues(formData: FormData) {
  const placement = text(formData, 'placement', 20) || 'bottom';
  const animation = text(formData, 'animation', 20) || 'fade';
  if (!placements.has(placement) || !animations.has(animation)) throw new Error('Posição ou animação inválida.');
  return {
    selector: text(formData, 'selector_catalog', 500) || text(formData, 'selector', 500),
    title: text(formData, 'step_title', 160),
    message: text(formData, 'message', 2000),
    placement,
    animation,
    action_label: text(formData, 'action_label', 60),
    action_href: text(formData, 'action_href', 500),
    media_url: text(formData, 'media_url', 2000),
    template_key: text(formData, 'template_key', 100) || 'editorial-card',
    template_html: text(formData, 'template_html', 30000),
    template_css: text(formData, 'template_css', 30000),
    template_js: text(formData, 'template_js', 20000),
  };
}

export async function createProductGuide(formData: FormData) {
  const actor = await requireAdmin('guidance.manage');
  const guideKey = text(formData, 'guide_key', 100).toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
  if (!/^[a-z0-9][a-z0-9._-]{2,99}$/.test(guideKey)) throw new Error('Use uma chave com pelo menos três caracteres.');
  const guide = { guide_key: guideKey, ...guideValues(formData, actor.userId), created_by: actor.userId };
  const step = stepValues(formData);
  if (!guide.name || !step.title || !step.message) throw new Error('Nome, título e mensagem são obrigatórios.');
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('product_guides').insert(guide).select('id').single();
  if (error) throw new Error(error.message);
  const { error: stepError } = await supabase.from('product_guide_steps').insert({ guide_id: data.id, position: 0, ...step });
  if (stepError) { await supabase.from('product_guides').delete().eq('id', data.id); throw new Error(stepError.message); }
  await writeAdminAudit({ actor, action: 'product_guide.created', targetType: 'product_guide', targetId: data.id, newData: guide as unknown as Json });
  revalidatePath('/admin/guidance');
}

export async function updateProductGuide(formData: FormData) {
  const actor = await requireAdmin('guidance.manage');
  const id = text(formData, 'id', 36);
  const stepId = text(formData, 'step_id', 36);
  const supabase = createAdminClient();
  const { data: previous } = await supabase.from('product_guides').select('*').eq('id', id).maybeSingle();
  const guide = guideValues(formData, actor.userId);
  const { error } = await supabase.from('product_guides').update(guide).eq('id', id);
  if (error) throw new Error(error.message);
  if (stepId) {
    const { error: stepError } = await supabase.from('product_guide_steps').update(stepValues(formData)).eq('id', stepId).eq('guide_id', id);
    if (stepError) throw new Error(stepError.message);
  }
  await writeAdminAudit({ actor, action: 'product_guide.updated', targetType: 'product_guide', targetId: id, oldData: previous as unknown as Json, newData: guide as unknown as Json });
  revalidatePath('/admin/guidance');
}

export async function updateProductGuideStep(formData: FormData) {
  const actor = await requireAdmin('guidance.manage');
  const guideId = text(formData, 'guide_id', 36);
  const stepId = text(formData, 'step_id', 36);
  const values = stepValues(formData);
  if (!values.title || !values.message) throw new Error('Título e mensagem são obrigatórios.');
  const supabase = createAdminClient();
  const { data: previous } = await supabase.from('product_guide_steps').select('*').eq('id', stepId).eq('guide_id', guideId).maybeSingle();
  const { error } = await supabase.from('product_guide_steps').update(values).eq('id', stepId).eq('guide_id', guideId);
  if (error) throw new Error(error.message);
  await writeAdminAudit({ actor, action: 'product_guide.step.updated', targetType: 'product_guide_step', targetId: stepId, oldData: previous as unknown as Json, newData: values as unknown as Json });
  revalidatePath('/admin/guidance');
}

export async function addProductGuideStep(formData: FormData) {
  const actor = await requireAdmin('guidance.manage');
  const guideId = text(formData, 'guide_id', 36);
  const values = stepValues(formData);
  if (!values.title || !values.message) throw new Error('Título e mensagem são obrigatórios.');
  const supabase = createAdminClient();
  const { data: last } = await supabase.from('product_guide_steps').select('position').eq('guide_id', guideId).order('position', { ascending: false }).limit(1).maybeSingle();
  const { data, error } = await supabase.from('product_guide_steps').insert({ guide_id: guideId, position: (last?.position ?? -1) + 1, ...values }).select('id').single();
  if (error) throw new Error(error.message);
  await writeAdminAudit({ actor, action: 'product_guide.step.created', targetType: 'product_guide_step', targetId: data.id, newData: values as unknown as Json });
  revalidatePath('/admin/guidance');
}

export async function reannounceProductGuide(formData: FormData) {
  const actor = await requireAdmin('guidance.manage');
  const id = text(formData, 'id', 36);
  const supabase = createAdminClient();
  const { data: guide, error: readError } = await supabase.from('product_guides').select('version').eq('id', id).single();
  if (readError) throw new Error(readError.message);
  const { error } = await supabase.from('product_guides').update({ version: guide.version + 1, enabled: true, updated_by: actor.userId }).eq('id', id);
  if (error) throw new Error(error.message);
  await writeAdminAudit({ actor, action: 'product_guide.reannounced', targetType: 'product_guide', targetId: id, metadata: { version: guide.version + 1 } });
  revalidatePath('/admin/guidance');
}
