'use server';

import { createHash, randomBytes, randomUUID } from 'node:crypto';

import { revalidatePath } from 'next/cache';

import { writeAdminAudit } from '@/features/admin/audit';
import { requireAdmin } from '@/features/admin/auth';
import { communicationChannels, publicationPath, slugifyPublication, type CampaignDraftInput, type CampaignStatus, type CommunicationChannel } from '@/features/admin/omnipublish/types';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Json, TablesInsert } from '@/types/database.generated';

const allowedChannels = new Set<string>(communicationChannels);
const allowedStatuses = new Set<CampaignStatus>(['draft', 'in_review', 'approved', 'scheduled', 'publishing', 'published', 'failed', 'archived']);
const creativeMediaMime = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'video/mp4', 'video/webm']);

function clean(value: unknown, max = 2000) {
  return String(value ?? '').trim().slice(0, max);
}

function safeFileName(name: string) {
  return name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(-120) || 'arquivo';
}

function legalSections(body: string) {
  const blocks = body.split(/\n{2,}/).map((value) => value.trim()).filter(Boolean);
  const sections: Array<{ heading: string; paragraphs: string[] }> = [];
  for (const block of blocks) {
    const lines = block.split('\n').map((value) => value.trim()).filter(Boolean);
    const heading = lines[0]?.match(/^#{1,6}\s+(.+)/)?.[1];
    if (heading) sections.push({ heading, paragraphs: lines.slice(1).join(' ').split(/(?<=[.!?])\s+/).filter(Boolean) });
    else if (sections.length) sections[sections.length - 1].paragraphs.push(lines.join(' '));
    else sections.push({ heading: 'Documento', paragraphs: [lines.join(' ')] });
  }
  return sections.length ? sections : [{ heading: 'Documento', paragraphs: ['Conteúdo em atualização.'] }];
}

export async function prepareCommunicationMediaUpload(input: { fileName: string; mimeType: string; size: number }) {
  await requireAdmin('communications.manage');
  if (!creativeMediaMime.has(input.mimeType)) throw new Error('Use JPG, PNG, WebP, AVIF, GIF, MP4 ou WebM.');
  if (input.size <= 0 || input.size > 52428800) throw new Error('O arquivo deve ter até 50 MB.');
  const uploadId = randomUUID();
  const path = `${uploadId}/${safeFileName(input.fileName)}`;
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage.from('omnipublish-media').createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message ?? 'Não foi possível preparar o upload.');
  return { uploadId, path, token: data.token };
}

export async function registerCommunicationMediaAsset(input: { uploadId: string; path: string; fileName: string; mimeType: string; size: number; title: string; altText: string; caption: string }) {
  const actor = await requireAdmin('communications.manage');
  if (!input.path.startsWith(`${input.uploadId}/`) || !creativeMediaMime.has(input.mimeType) || input.size <= 0 || input.size > 52428800) throw new Error('Sessão de mídia inválida.');
  const supabase = createAdminClient();
  const { data: files } = await supabase.storage.from('omnipublish-media').list(input.uploadId, { search: input.path.slice(input.uploadId.length + 1), limit: 1 });
  if (!files?.some((file) => `${input.uploadId}/${file.name}` === input.path)) throw new Error('O upload não foi concluído.');
  const { data: publicData } = supabase.storage.from('omnipublish-media').getPublicUrl(input.path);
  const mediaType = input.mimeType === 'image/gif' ? 'gif' : input.mimeType.startsWith('video/') ? 'video' : 'image';
  const record: TablesInsert<'communication_media_assets'> = {
    storage_path: input.path,
    public_url: publicData.publicUrl,
    file_name: clean(input.fileName, 240),
    media_type: mediaType,
    mime_type: input.mimeType,
    size_bytes: input.size,
    title: clean(input.title, 160),
    alt_text: clean(input.altText, 500),
    caption: clean(input.caption, 1000),
    created_by: actor.userId,
  };
  const { data, error } = await supabase.from('communication_media_assets').insert(record).select('*').single();
  if (error) throw new Error(error.message);
  await writeAdminAudit({ actor, action: 'omnipublish.asset.created', targetType: 'communication_media_asset', targetId: data.id, newData: record as unknown as Json });
  revalidatePath('/admin/publish/new');
  return data;
}

export async function saveCommunicationComponent(input: { name: string; description: string; category: string; htmlCode: string; cssCode: string; jsCode: string }) {
  const actor = await requireAdmin('communications.manage');
  const categories = new Set(['hero', 'content', 'media', 'quote', 'cta', 'footer', 'motion', 'custom']);
  if (clean(input.name, 120).length < 2) throw new Error('Dê um nome ao componente.');
  if (!categories.has(input.category)) throw new Error('Categoria de componente inválida.');
  if (!input.htmlCode.trim()) throw new Error('O componente precisa de HTML.');
  const key = `custom.${clean(input.name, 80).toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.${randomUUID().slice(0, 8)}`;
  const record: TablesInsert<'communication_components'> = {
    component_key: key,
    name: clean(input.name, 120),
    category: input.category,
    description: clean(input.description, 500),
    html_code: input.htmlCode.slice(0, 100000),
    css_code: input.cssCode.slice(0, 100000),
    js_code: input.jsCode.slice(0, 50000),
    icon_name: 'code',
    is_official: false,
    is_active: true,
    created_by: actor.userId,
    updated_by: actor.userId,
  };
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('communication_components').insert(record).select('*').single();
  if (error) throw new Error(error.message);
  await writeAdminAudit({ actor, action: 'omnipublish.component.created', targetType: 'communication_component', targetId: data.id, newData: record as unknown as Json });
  revalidatePath('/admin/publish/new');
  return data;
}

function validateCampaign(input: CampaignDraftInput) {
  const channels = Array.from(new Set(input.channels)).filter((channel) => allowedChannels.has(channel));
  if (clean(input.internalName, 160).length < 2) throw new Error('Informe um nome interno para a campanha.');
  if (clean(input.title, 180).length < 2) throw new Error('Informe o título principal da comunicação.');
  if (!channels.length) throw new Error('Selecione ao menos um canal.');
  for (const channel of channels) {
    if (!clean(input.items[channel]?.title, 200)) throw new Error(`Preencha o título do canal ${channel}.`);
  }
  return channels;
}

export async function createCommunicationCampaign(input: CampaignDraftInput) {
  const actor = await requireAdmin('communications.manage');
  const channels = validateCampaign(input);
  const supabase = createAdminClient();
  const scheduledFor = input.scheduledFor ? new Date(input.scheduledFor).toISOString() : null;
  const audienceRules = {
    operator: input.audience.operator === 'or' ? 'or' : 'and',
    rules: [
      ...(input.audience.accountStatus ? [{ field: 'account_status', operator: 'equals', value: clean(input.audience.accountStatus, 40) }] : []),
      ...(input.audience.plan ? [{ field: 'plan', operator: 'equals', value: clean(input.audience.plan, 40) }] : []),
      ...(input.audience.locale ? [{ field: 'locale', operator: 'equals', value: clean(input.audience.locale, 20) }] : []),
    ],
  };
  const campaignRecord = {
    internal_name: clean(input.internalName, 160),
    title: clean(input.title, 180),
    summary: clean(input.summary),
    status: 'draft',
    selected_channels: channels,
    audience_rules: audienceRules as Json,
    campaign_tags: input.tags.map((tag) => clean(tag, 40)).filter(Boolean).slice(0, 20),
    scheduled_for: scheduledFor,
    timezone: clean(input.timezone, 80) || 'America/Sao_Paulo',
    created_by: actor.userId,
    updated_by: actor.userId,
  };
  const { data: campaign, error: campaignError } = await supabase.from('communication_campaigns').insert(campaignRecord).select('id').single();
  if (campaignError) throw new Error(campaignError.message);

  const plannedItems = channels.map((channel) => {
    const requestedSlug = clean(input.items[channel].fields.slug, 180);
    const slug = slugifyPublication(requestedSlug || input.items[channel].title);
    return { channel, requestedSlug, slug, path: publicationPath(channel, slug) };
  });
  const { data: collisions } = await supabase.from('communication_items').select('public_path').in('public_path', plannedItems.map((item) => item.path));
  const existingPaths = new Set((collisions ?? []).map((item) => item.public_path));
  const itemRecords = plannedItems.map(({ channel, requestedSlug, slug: baseSlug, path }) => {
    const slug = existingPaths.has(path) && !requestedSlug ? `${baseSlug}-${campaign.id.slice(0, 8)}` : baseSlug;
    return ({
    campaign_id: campaign.id,
    channel,
    title: clean(input.items[channel].title, 200),
    slug,
    public_path: publicationPath(channel, slug),
    is_public: true,
    seo: {
      title: clean(input.items[channel].fields.meta_title || input.items[channel].title, 180),
      description: clean(input.items[channel].fields.meta_description || input.items[channel].fields.excerpt || input.summary, 300),
    } as Json,
    status: 'draft',
    payload: input.items[channel].fields as Json,
    audience_rules: audienceRules as Json,
    scheduled_for: scheduledFor,
    created_by: actor.userId,
    updated_by: actor.userId,
  }); });
  const { error: itemsError } = await supabase.from('communication_items').insert(itemRecords);
  if (itemsError) {
    await supabase.from('communication_campaigns').delete().eq('id', campaign.id);
    throw new Error(itemsError.message);
  }
  await writeAdminAudit({ actor, action: 'omnipublish.campaign.created', targetType: 'communication_campaign', targetId: campaign.id, newData: campaignRecord as unknown as Json, metadata: { channels } });
  revalidatePath('/admin/publish');
  return { id: campaign.id };
}

export async function changeCommunicationCampaignStatus(formData: FormData) {
  const actor = await requireAdmin('communications.manage');
  const id = clean(formData.get('id'), 80);
  const requestedStatus = clean(formData.get('status'), 30) as CampaignStatus;
  if (!allowedStatuses.has(requestedStatus)) throw new Error('Status de campanha inválido.');
  const supabase = createAdminClient();
  const { data: previous, error: readError } = await supabase.from('communication_campaigns').select('*').eq('id', id).single();
  if (readError) throw new Error(readError.message);

  let status = requestedStatus;
  if (requestedStatus === 'publishing' && previous.scheduled_for && new Date(previous.scheduled_for).getTime() > Date.now()) status = 'scheduled';
  const changes = { status, updated_by: actor.userId, ...(status === 'published' ? { published_at: new Date().toISOString() } : {}) };
  const { error } = await supabase.from('communication_campaigns').update(changes).eq('id', id);
  if (error) throw new Error(error.message);

  if (status === 'publishing' || status === 'scheduled') {
    const itemStatus = status === 'scheduled' ? 'queued' : 'queued';
    const { data: items, error: itemError } = await supabase.from('communication_items').update({ status: itemStatus, updated_by: actor.userId }).eq('campaign_id', id).select('id');
    if (itemError) throw new Error(itemError.message);
    if (items?.length) {
      const { error: queueError } = await supabase.from('communication_delivery_attempts').insert(items.map((item) => ({ campaign_id: id, item_id: item.id, status: 'queued', provider: 'pending_connector', response_body: {} })));
      if (queueError) throw new Error(queueError.message);
    }
  } else if (status === 'published') {
    const publishedAt = new Date().toISOString();
    const { data: publishedItems, error: publishError } = await supabase.from('communication_items').update({ status: 'published', published_at: publishedAt, updated_by: actor.userId }).eq('campaign_id', id).select('id, channel, title, slug, public_path, payload');
    if (publishError) throw new Error(publishError.message);
    for (const item of publishedItems ?? []) {
      const channel = item.channel as CommunicationChannel;
      revalidatePath(item.public_path ?? publicationPath(channel, item.slug));
      revalidatePath(publicationPath(channel, '').replace(/\/$/, ''));
      if (channel === 'legal') {
        const payload = item.payload && !Array.isArray(item.payload) && typeof item.payload === 'object' ? item.payload as Record<string, Json | undefined> : {};
        const body = clean(payload.body, 100000);
        const legalRecord: TablesInsert<'legal_documents'> = {
          slug: item.slug,
          title: item.title,
          short_description: clean(payload.tldr || previous.summary, 1000),
          department: 'Jurídico & Produto',
          version: clean(payload.version, 40) || '1.0',
          effective_at: clean(payload.effective_date, 20) || publishedAt.slice(0, 10),
          sections: legalSections(body) as unknown as Json,
          related_features: previous.campaign_tags,
          pdf_href: '',
          is_published: true,
        };
        const { error: legalError } = await supabase.from('legal_documents').upsert(legalRecord, { onConflict: 'slug' });
        if (legalError) throw new Error(legalError.message);
        revalidatePath('/admin/legal');
      }
    }
  }

  await writeAdminAudit({ actor, action: `omnipublish.campaign.${status}`, targetType: 'communication_campaign', targetId: id, oldData: previous as unknown as Json, newData: changes as unknown as Json });
  revalidatePath('/admin/publish');
}

export async function createCommunicationApiKey(input: { name: string; scopes: string[]; expiresAt?: string | null }) {
  const actor = await requireAdmin('api.manage');
  const name = clean(input.name, 120);
  if (name.length < 2) throw new Error('Informe um nome para a chave.');
  const allowedScopes = new Set(['catalogs:read', 'publications:read', 'campaigns:read', 'campaigns:write', 'receipts:write']);
  const scopes = Array.from(new Set(input.scopes)).filter((scope) => allowedScopes.has(scope));
  if (!scopes.length) throw new Error('Selecione ao menos um escopo.');
  const prefix = randomBytes(6).toString('hex');
  const token = `ac_live_${prefix}_${randomBytes(24).toString('base64url')}`;
  const keyHash = createHash('sha256').update(token).digest('hex');
  const supabase = createAdminClient();
  const record: TablesInsert<'communication_api_keys'> = {
    name,
    key_prefix: `ac_live_${prefix}`,
    key_hash: keyHash,
    scopes,
    expires_at: input.expiresAt ? new Date(input.expiresAt).toISOString() : null,
    created_by: actor.userId,
  };
  const { data, error } = await supabase.from('communication_api_keys').insert(record).select('id, name, key_prefix, scopes, status, expires_at, created_at').single();
  if (error) throw new Error(error.message);
  await writeAdminAudit({ actor, action: 'omnipublish.api_key.created', targetType: 'communication_api_key', targetId: data.id, newData: { ...record, key_hash: '[redacted]' } as unknown as Json });
  revalidatePath('/admin/apis');
  return { ...data, token };
}

export async function revokeCommunicationApiKey(formData: FormData) {
  const actor = await requireAdmin('api.manage');
  const id = clean(formData.get('id'), 80);
  const supabase = createAdminClient();
  const { error } = await supabase.from('communication_api_keys').update({ status: 'revoked', revoked_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(error.message);
  await writeAdminAudit({ actor, action: 'omnipublish.api_key.revoked', targetType: 'communication_api_key', targetId: id, newData: { status: 'revoked' } });
  revalidatePath('/admin/apis');
}

export async function archiveCommunicationCampaign(formData: FormData) {
  const actor = await requireAdmin('communications.manage');
  const id = clean(formData.get('id'), 80);
  const supabase = createAdminClient();
  const { data: previous } = await supabase.from('communication_campaigns').select('*').eq('id', id).maybeSingle();
  const { error } = await supabase.from('communication_campaigns').update({ status: 'archived', updated_by: actor.userId }).eq('id', id);
  if (error) throw new Error(error.message);
  await writeAdminAudit({ actor, action: 'omnipublish.campaign.archived', targetType: 'communication_campaign', targetId: id, oldData: previous as unknown as Json, newData: { status: 'archived' } });
  revalidatePath('/admin/publish');
}
