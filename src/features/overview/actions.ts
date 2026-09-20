'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import type { WritingGoalType } from '@/features/overview/types';
import { createClient } from '@/lib/supabase/server';

const goalTypes = new Set<WritingGoalType>(['word_count', 'chapter_count', 'deadline']);
function text(formData: FormData, key: string, max = 120) { return String(formData.get(key) ?? '').trim().slice(0, max); }
function returnTo(workId: string) { return `/overview/goals?work=${encodeURIComponent(workId)}`; }

async function auth() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect('/login?next=/overview/goals');
  return { supabase, userId };
}

export async function createWritingGoal(formData: FormData) {
  const { supabase, userId } = await auth();
  const workId = text(formData, 'workId', 36);
  const type = text(formData, 'type', 30) as WritingGoalType;
  const title = text(formData, 'title');
  const target = Math.max(0, Math.min(10000000, Number(formData.get('target') ?? 0) || 0));
  const dueDate = text(formData, 'dueDate', 10) || null;
  if (!workId || !title || !goalTypes.has(type)) redirect(returnTo(workId));
  const { error } = await supabase.from('writing_goals').insert({ owner_id: userId, work_id: workId, goal_type: type, title, target_value: type === 'deadline' ? 1 : target, due_date: dueDate });
  if (error) throw new Error(`Não foi possível criar a meta (${error.code}).`, { cause: error });
  revalidatePath('/overview', 'layout');
  redirect(returnTo(workId));
}

export async function toggleWritingGoal(formData: FormData) {
  const { supabase, userId } = await auth();
  const workId = text(formData, 'workId', 36);
  const completed = formData.get('completed') === 'true';
  const { error } = await supabase.from('writing_goals').update({ completed_at: completed ? new Date().toISOString() : null }).eq('id', text(formData, 'goalId', 36)).eq('owner_id', userId).eq('work_id', workId);
  if (error) throw new Error(`Não foi possível atualizar a meta (${error.code}).`, { cause: error });
  revalidatePath('/overview', 'layout');
  redirect(returnTo(workId));
}

export async function deleteWritingGoal(formData: FormData) {
  const { supabase, userId } = await auth();
  const workId = text(formData, 'workId', 36);
  const { error } = await supabase.from('writing_goals').delete().eq('id', text(formData, 'goalId', 36)).eq('owner_id', userId).eq('work_id', workId);
  if (error) throw new Error(`Não foi possível apagar a meta (${error.code}).`, { cause: error });
  revalidatePath('/overview', 'layout');
  redirect(returnTo(workId));
}

