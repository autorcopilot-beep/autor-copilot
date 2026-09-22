import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';

import { mapEncyclopediaEntry, type WritingProject } from '@/features/writing/types';
import { defaultExtensionRuntime, extensionCatalog, type ExtensionId, type ExtensionRuntimeState } from '@/features/extensions/catalog';
import { activeEntitlementIds } from '@/features/extensions/entitlements';
import type { Database } from '@/types/database.generated';

function mapDocument(row: Database['public']['Tables']['writing_documents']['Row']) {
  return {
    id: row.id,
    parentId: row.parent_id,
    kind: row.kind,
    title: row.title,
    contentHtml: row.content_html === '<p>Comece a escrever sua história aqui.</p>' ? '' : row.content_html,
    synopsis: row.synopsis,
    status: row.status,
    goal: row.word_goal,
    position: row.position,
    updatedAt: row.updated_at,
  };
}

function rolloutBucket(userId: string, flag: string) {
  return Array.from(`${userId}:${flag}`).reduce((total, character) => (total * 31 + character.charCodeAt(0)) % 100, 0);
}

export async function loadExtensionRuntimeAccess(supabase: SupabaseClient<Database>, userId: string): Promise<ExtensionRuntimeState> {
  const [catalogResult, accessResult, flagsResult, installationsResult, entitlementsResult] = await Promise.all([
    supabase.from('extension_catalog').select('id, allowed_groups, feature_flag, price_model').eq('is_published', true),
    supabase.from('user_access_profiles').select('groups, status').eq('user_id', userId).maybeSingle(),
    supabase.from('feature_flags').select('key, enabled, rollout_percentage, allowed_groups'),
    supabase.from('user_extension_installations').select('extension_id, is_active').eq('user_id', userId),
    supabase.from('user_extension_entitlements').select('extension_id, status, starts_at, ends_at').eq('user_id', userId),
  ]);
  if (catalogResult.error || flagsResult.error || installationsResult.error || entitlementsResult.error || accessResult.data?.status === 'suspended') return defaultExtensionRuntime;
  const groups = accessResult.data?.groups?.length ? accessResult.data.groups : ['free'];
  const flags = new Map((flagsResult.data ?? []).map((flag) => [flag.key, flag]));
  const installs = new Map((installationsResult.data ?? []).map((installation) => [installation.extension_id, installation.is_active]));
  const entitlements = activeEntitlementIds(entitlementsResult.data ?? []);
  const available = new Set((catalogResult.data ?? []).filter((extension) => {
    if (!extension.allowed_groups.some((group) => groups.includes(group))) return false;
    const acquired = extension.price_model === 'free'
      || (extension.price_model === 'pro_included' && groups.includes('pro'))
      || entitlements.has(extension.id);
    if (!acquired) return false;
    if (extension.feature_flag) {
      const flag = flags.get(extension.feature_flag);
      if (!flag?.enabled || !flag.allowed_groups.some((group) => groups.includes(group)) || rolloutBucket(userId, flag.key) >= flag.rollout_percentage) return false;
    }
    return true;
  }).map((extension) => extension.id));
  return Object.fromEntries(extensionCatalog.map((extension) => [extension.id, available.has(extension.id) && installs.get(extension.id) === true])) as Record<ExtensionId, boolean>;
}

export async function loadWritingProject(
  supabase: SupabaseClient<Database>,
  userId: string,
  requestedDocumentId?: string,
  requestedWorkId?: string,
): Promise<WritingProject> {
  const { data: requestedWork, error: workReadError } = await supabase
    .from('works')
    .select('id, title, updated_at')
    .eq('owner_id', userId)
    .eq(requestedWorkId ? 'id' : 'is_primary', requestedWorkId ?? true)
    .limit(1)
    .maybeSingle();

  if (workReadError) throw workReadError;
  let existingWork = requestedWork;

  if (!existingWork && requestedWorkId) {
    const fallback = await supabase
      .from('works')
      .select('id, title, updated_at')
      .eq('owner_id', userId)
      .eq('is_primary', true)
      .limit(1)
      .maybeSingle();
    if (fallback.error) throw fallback.error;
    existingWork = fallback.data;
  }

  let work = existingWork;
  if (!work) {
    const { data: createdWork, error: workCreateError } = await supabase
      .from('works')
      .insert({ owner_id: userId, title: 'Meu primeiro livro', is_primary: true })
      .select('id, title, updated_at')
      .maybeSingle();

    if (workCreateError?.code === '23505') {
      const { data: concurrentWork, error: concurrentWorkError } = await supabase
        .from('works')
        .select('id, title, updated_at')
        .eq('owner_id', userId)
        .eq('is_primary', true)
        .single();
      if (concurrentWorkError) throw concurrentWorkError;
      work = concurrentWork;
    } else {
      if (workCreateError) throw workCreateError;
      if (!createdWork) throw new Error('Não foi possível preparar a obra inicial.');
      work = createdWork;
    }
  }

  const { error: bootstrapError } = await supabase.rpc('ensure_initial_writing_documents', {
    target_work_id: work.id,
  });
  if (bootstrapError) {
    throw new Error(`Não foi possível preparar os documentos iniciais (${bootstrapError.code}).`, {
      cause: bootstrapError,
    });
  }

  const [documentsResult, encyclopediaResult] = await Promise.all([
    supabase
      .from('writing_documents')
      .select('*')
      .eq('owner_id', userId)
      .eq('work_id', work.id)
      .order('position', { ascending: true }),
    supabase
      .from('encyclopedia_entries')
      .select('*')
      .eq('owner_id', userId)
      .eq('work_id', work.id)
      .order('name', { ascending: true }),
  ]);

  const { data: existingDocuments, error: documentsReadError } = documentsResult;
  const { data: encyclopediaRows, error: encyclopediaReadError } = encyclopediaResult;

  if (documentsReadError) throw documentsReadError;
  const encyclopediaTableUnavailable = encyclopediaReadError?.code === 'PGRST205';
  if (encyclopediaReadError && !encyclopediaTableUnavailable) throw encyclopediaReadError;

  const documents = existingDocuments ?? [];
  if (!documents.length) throw new Error('A obra foi criada sem documentos iniciais.');

  const mappedDocuments = documents.map(mapDocument);
  const activeDocumentId = mappedDocuments.some((item) => item.id === requestedDocumentId)
    ? requestedDocumentId as string
    : mappedDocuments[0].id;

  return {
    id: work.id,
    title: work.title,
    documents: mappedDocuments,
    encyclopediaEntries: (encyclopediaRows ?? []).map(mapEncyclopediaEntry),
    encyclopediaPersistence: encyclopediaTableUnavailable ? 'local' : 'cloud',
    activeDocumentId,
    updatedAt: work.updated_at,
  };
}
