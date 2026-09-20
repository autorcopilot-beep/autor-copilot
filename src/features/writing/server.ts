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
): Promise<WritingProject> {
  const { data: existingWork, error: workReadError } = await supabase
    .from('works')
    .select('id, title, updated_at')
    .eq('owner_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (workReadError) throw workReadError;

  let work = existingWork;
  if (!work) {
    const { data: createdWork, error: workCreateError } = await supabase
      .from('works')
      .insert({ owner_id: userId, title: 'Meu primeiro livro' })
      .select('id, title, updated_at')
      .single();
    if (workCreateError) throw workCreateError;
    work = createdWork;
  }

  const { data: existingDocuments, error: documentsReadError } = await supabase
    .from('writing_documents')
    .select('*')
    .eq('owner_id', userId)
    .eq('work_id', work.id)
    .order('position', { ascending: true });

  if (documentsReadError) throw documentsReadError;

  let documents = existingDocuments ?? [];
  if (!documents.length) {
    const { data: createdDocuments, error: documentsCreateError } = await supabase
      .from('writing_documents')
      .insert([
        {
          owner_id: userId,
          work_id: work.id,
          kind: 'chapter',
          title: 'Capítulo 1',
          content_html: '<p>Comece a escrever sua história aqui.</p>',
          word_goal: 1800,
          position: 0,
        },
        {
          owner_id: userId,
          work_id: work.id,
          kind: 'chapter',
          title: 'Capítulo 2',
          word_goal: 1800,
          position: 1,
        },
      ])
      .select('*');
    if (documentsCreateError) throw documentsCreateError;
    documents = createdDocuments ?? [];
  }

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
