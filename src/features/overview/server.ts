import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';

import type { OverviewDocument, OverviewGoal, OverviewWork } from '@/features/overview/types';
import type { Database } from '@/types/database.generated';

function countWords(html: string) {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim();
  return text ? text.split(/\s+/u).length : 0;
}

export async function loadOverview(supabase: SupabaseClient<Database>, userId: string, requestedWorkId?: string) {
  const { data: workRows, error: worksError } = await supabase
    .from('works')
    .select('id, title, subtitle, genre, status, word_goal, updated_at')
    .eq('owner_id', userId)
    .is('archived_at', null)
    .order('updated_at', { ascending: false });
  if (worksError) throw worksError;
  const works: OverviewWork[] = (workRows ?? []).map((work) => ({ id: work.id, title: work.title, subtitle: work.subtitle, genre: work.genre, status: work.status, wordGoal: work.word_goal, updatedAt: work.updated_at }));
  const selectedWork = works.find((work) => work.id === requestedWorkId) ?? works[0];
  if (!selectedWork) return { works, selectedWork: null, documents: [], goals: [], metrics: { words: 0, chapters: 0, scenes: 0, notes: 0, completed: 0, progress: 0 } };

  const [{ data: documentRows, error: documentsError }, { data: goalRows, error: goalsError }] = await Promise.all([
    supabase.from('writing_documents').select('id, title, kind, status, content_html, word_goal, updated_at').eq('owner_id', userId).eq('work_id', selectedWork.id).order('updated_at', { ascending: false }),
    supabase.from('writing_goals').select('id, goal_type, title, target_value, due_date, completed_at').eq('owner_id', userId).eq('work_id', selectedWork.id).order('completed_at', { ascending: true, nullsFirst: true }).order('due_date', { ascending: true }),
  ]);
  if (documentsError) throw documentsError;
  if (goalsError) throw goalsError;

  const documents: OverviewDocument[] = (documentRows ?? []).map((document) => ({
    id: document.id,
    title: document.title,
    kind: document.kind,
    status: document.status,
    wordCount: countWords(document.content_html),
    wordGoal: document.word_goal,
    updatedAt: document.updated_at,
  }));
  const words = documents.reduce((sum, document) => sum + document.wordCount, 0);
  const chapters = documents.filter((document) => document.kind === 'chapter').length;
  const metrics = {
    words,
    chapters,
    scenes: documents.filter((document) => document.kind === 'scene').length,
    notes: documents.filter((document) => document.kind === 'note').length,
    completed: documents.filter((document) => document.status === 'final').length,
    progress: selectedWork.wordGoal > 0 ? Math.min(100, Math.round((words / selectedWork.wordGoal) * 100)) : 0,
  };
  const goals: OverviewGoal[] = (goalRows ?? []).map((goal) => {
    const current = goal.goal_type === 'word_count' ? words : goal.goal_type === 'chapter_count' ? chapters : goal.completed_at ? 1 : 0;
    const target = goal.goal_type === 'deadline' ? 1 : goal.target_value;
    return { id: goal.id, type: goal.goal_type, title: goal.title, target, current, progress: goal.completed_at ? 100 : target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0, dueDate: goal.due_date, completedAt: goal.completed_at };
  });
  return { works, selectedWork, documents, goals, metrics };
}

