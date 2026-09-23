'use server';

import { revalidatePath } from 'next/cache';

import { writeAdminAudit } from '@/features/admin/audit';
import { requireAdmin } from '@/features/admin/auth';
import { legalDocuments } from '@/lib/legal/documents';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Json } from '@/types/database.generated';

function list(value: FormDataEntryValue | null) {
  return String(value ?? '').split(',').map((item) => item.trim()).filter(Boolean);
}

export async function updateExtensionControl(formData: FormData) {
  const actor = await requireAdmin('features.manage');
  const id = String(formData.get('id') ?? '');
  const supabase = createAdminClient();
  const { data: previous } = await supabase.from('extension_catalog').select('*').eq('id', id).maybeSingle();
  const productKind = String(formData.get('product_kind') ?? 'extension');
  const mediaType = String(formData.get('media_type') ?? 'none');
  const mediaUrl = String(formData.get('media_url') ?? '').trim();
  if (!['extension', 'plugin', 'connector'].includes(productKind)) throw new Error('Tipo de item inválido.');
  if (!['none', 'gif', 'mp4'].includes(mediaType)) throw new Error('Tipo de mídia inválido.');
  if (mediaUrl && !/^(https:\/\/|\/)/i.test(mediaUrl)) throw new Error('Use uma URL HTTPS ou um caminho público iniciado por /.');
  const changes = {
    product_kind: productKind,
    price_model: String(formData.get('price_model') ?? 'free'),
    price_cents: Math.max(0, Number(formData.get('price_cents') ?? 0)),
    allowed_groups: list(formData.get('allowed_groups')),
    tags: list(formData.get('tags')),
    media_type: mediaType,
    media_url: mediaType === 'none' ? '' : mediaUrl,
    is_published: formData.get('is_published') === 'on',
    is_featured: formData.get('is_featured') === 'on',
  };
  const { error } = await supabase.from('extension_catalog').update(changes).eq('id', id);
  if (error) throw new Error(error.message);
  await writeAdminAudit({ actor, action: 'extension.control.updated', targetType: 'extension', targetId: id, oldData: previous as unknown as Json, newData: changes as unknown as Json });
  revalidatePath('/admin/extensions');
}

export async function updateExtensionEntitlement(formData: FormData) {
  const actor = await requireAdmin('features.manage');
  const userId = String(formData.get('user_id') ?? '').trim();
  const extensionId = String(formData.get('extension_id') ?? '').trim();
  const status = String(formData.get('status') ?? 'active');
  const source = String(formData.get('source') ?? 'admin');
  const endsAtValue = String(formData.get('ends_at') ?? '').trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId)) throw new Error('Informe um UUID de usuário válido.');
  if (!['active', 'pending', 'expired', 'revoked'].includes(status)) throw new Error('Status de licença inválido.');
  if (!['purchase', 'subscription', 'plan', 'admin', 'promotion'].includes(source)) throw new Error('Origem de licença inválida.');
  const supabase = createAdminClient();
  const { data: previous } = await supabase.from('user_extension_entitlements').select('*').eq('user_id', userId).eq('extension_id', extensionId).maybeSingle();
  const changes = { user_id: userId, extension_id: extensionId, status, source, ends_at: endsAtValue ? new Date(endsAtValue).toISOString() : null, granted_by: actor.userId };
  const { error } = await supabase.from('user_extension_entitlements').upsert(changes, { onConflict: 'user_id,extension_id' });
  if (error) throw new Error(error.message);
  if (status !== 'active') {
    await supabase.from('user_extension_installations').update({ is_active: false }).eq('user_id', userId).eq('extension_id', extensionId);
  }
  await writeAdminAudit({ actor, action: 'extension.entitlement.updated', targetType: 'extension_entitlement', targetId: `${userId}:${extensionId}`, oldData: previous as unknown as Json, newData: changes as unknown as Json });
  revalidatePath('/admin/extensions');
  revalidatePath('/account/extensions');
}

export async function updateFeatureFlag(formData: FormData) {
  const actor = await requireAdmin('features.manage');
  const key = String(formData.get('key') ?? '');
  const changes = { enabled: formData.get('enabled') === 'on', rollout_percentage: Math.min(100, Math.max(0, Number(formData.get('rollout_percentage') ?? 0))), allowed_groups: list(formData.get('allowed_groups')), tags: list(formData.get('tags')) };
  const supabase = createAdminClient();
  const { data: previous } = await supabase.from('feature_flags').select('*').eq('key', key).maybeSingle();
  const { error } = await supabase.from('feature_flags').update(changes).eq('key', key);
  if (error) throw new Error(error.message);
  await writeAdminAudit({ actor, action: 'feature_flag.updated', targetType: 'feature_flag', targetId: key, oldData: previous as unknown as Json, newData: changes as unknown as Json });
  revalidatePath('/admin/flags');
}

export async function updateUserAccess(formData: FormData) {
  const actor = await requireAdmin('users.suspend');
  const userId = String(formData.get('user_id') ?? '');
  const changes = { user_id: userId, status: String(formData.get('status') ?? 'active'), groups: list(formData.get('groups')), tags: list(formData.get('tags')), notes: String(formData.get('notes') ?? '').slice(0, 2000) };
  const supabase = createAdminClient();
  const { data: previous } = await supabase.from('user_access_profiles').select('*').eq('user_id', userId).maybeSingle();
  const { error } = await supabase.from('user_access_profiles').upsert(changes, { onConflict: 'user_id' });
  if (error) throw new Error(error.message);
  await writeAdminAudit({ actor, action: 'user.access.updated', targetType: 'user', targetId: userId, oldData: previous as unknown as Json, newData: changes as unknown as Json });
  revalidatePath('/admin/users');
}

export async function updateUserSubscription(formData: FormData) {
  const actor = await requireAdmin('billing.manage');
  const userId = String(formData.get('user_id') ?? '');
  const planCode = String(formData.get('plan_code') ?? 'free');
  const status = String(formData.get('subscription_status') ?? 'active');
  const billingInterval = String(formData.get('billing_interval') ?? 'none');
  if (!['free', 'essential', 'creator', 'studio', 'enterprise'].includes(planCode)) throw new Error('Plano inválido.');
  if (!['trialing', 'active', 'past_due', 'paused', 'canceled', 'legacy'].includes(status)) throw new Error('Status de assinatura inválido.');
  if (!['none', 'monthly', 'annual', 'lifetime'].includes(billingInterval)) throw new Error('Ciclo de cobrança inválido.');
  const renewsAt = String(formData.get('renews_at') ?? '').trim();
  const changes = {
    user_id: userId,
    plan_code: planCode,
    status,
    billing_interval: billingInterval,
    price_cents: Math.max(0, Number(formData.get('price_cents') ?? 0)),
    currency: String(formData.get('currency') ?? 'BRL').toUpperCase().slice(0, 3),
    renews_at: renewsAt ? new Date(renewsAt).toISOString() : null,
    legacy_price_locked: formData.get('legacy_price_locked') === 'on',
    updated_by: actor.userId,
  };
  const supabase = createAdminClient();
  const { data: previous } = await supabase.from('user_subscriptions').select('*').eq('user_id', userId).maybeSingle();
  const { error } = await supabase.from('user_subscriptions').upsert(changes, { onConflict: 'user_id' });
  if (error) throw new Error(error.message);
  await writeAdminAudit({ actor, action: 'user.subscription.updated', targetType: 'user', targetId: userId, oldData: previous as unknown as Json, newData: changes as unknown as Json });
  revalidatePath('/admin/users');
}

export async function syncLegalDocuments() {
  const actor = await requireAdmin('legal.manage');
  const supabase = createAdminClient();
  const records = legalDocuments.map((document) => ({ slug: document.slug, title: document.title, short_description: document.shortDescription, department: document.department, sections: document.sections as unknown as Json, related_features: document.relatedFeatures, pdf_href: document.pdfHref, is_published: true, effective_at: document.updatedAt }));
  const { error } = await supabase.from('legal_documents').upsert(records, { onConflict: 'slug', ignoreDuplicates: true });
  if (error) throw new Error(error.message);
  await writeAdminAudit({ actor, action: 'legal.documents.synchronized', targetType: 'legal_document', metadata: { count: records.length } });
  revalidatePath('/admin/legal');
}

export async function updateLegalDocument(formData: FormData) {
  const actor = await requireAdmin('legal.manage');
  const slug = String(formData.get('slug') ?? '');
  const supabase = createAdminClient();
  const { data: previous } = await supabase.from('legal_documents').select('*').eq('slug', slug).maybeSingle();
  let sections: Json;
  try {
    sections = JSON.parse(String(formData.get('sections') ?? '[]')) as Json;
    if (!Array.isArray(sections)) throw new Error('Formato inválido');
  } catch {
    throw new Error('O conteúdo jurídico deve ser um array JSON válido de seções.');
  }
  const changes = { title: String(formData.get('title') ?? ''), short_description: String(formData.get('short_description') ?? ''), department: String(formData.get('department') ?? ''), version: String(formData.get('version') ?? '1.0'), effective_at: String(formData.get('effective_at') ?? new Date().toISOString().slice(0, 10)), is_published: formData.get('is_published') === 'on', related_features: list(formData.get('related_features')), sections };
  const { error } = await supabase.from('legal_documents').update(changes).eq('slug', slug);
  if (error) throw new Error(error.message);
  await writeAdminAudit({ actor, action: 'legal.document.updated', targetType: 'legal_document', targetId: slug, oldData: previous as unknown as Json, newData: changes as unknown as Json });
  revalidatePath('/admin/legal');
  revalidatePath(`/legal/${slug}`);
}
