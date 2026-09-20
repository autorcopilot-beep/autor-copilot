import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';

import type { WritingProject } from '@/features/writing/types';
import type { Database } from '@/types/database.generated';

function mapDocument(row: Database['public']['Tables']['writing_documents']['Row']) {
  return {
    id: row.id,
    parentId: row.parent_id,
    kind: row.kind,
    title: row.title,
    contentHtml: row.content_html,
    synopsis: row.synopsis,
    status: row.status,
    goal: row.word_goal,
    position: row.position,
    updatedAt: row.updated_at,
  };
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

  const { data: existingDocuments, error: documentsReadError } = await supabase
    .from('writing_documents')
    .select('*')
    .eq('owner_id', userId)
    .eq('work_id', work.id)
    .order('position', { ascending: true });

  if (documentsReadError) throw documentsReadError;

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
    activeDocumentId,
    updatedAt: work.updated_at,
  };
}
