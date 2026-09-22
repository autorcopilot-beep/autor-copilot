import type { Enums } from '@/types/database.generated';

export type OverviewView = 'dashboard' | 'activity' | 'goals';
export type WritingGoalType = Enums<'writing_goal_type'>;

export type OverviewWork = {
  id: string;
  title: string;
  subtitle: string;
  genre: string;
  status: Enums<'library_work_status'>;
  wordGoal: number;
  updatedAt: string;
};

export type OverviewDocument = {
  id: string;
  title: string;
  kind: Enums<'writing_document_kind'>;
  status: Enums<'writing_document_status'>;
  wordCount: number;
  wordGoal: number;
  updatedAt: string;
};

export type OverviewGoal = {
  id: string;
  type: WritingGoalType;
  title: string;
  target: number;
  current: number;
  progress: number;
  dueDate: string | null;
  completedAt: string | null;
};

export const overviewViews: OverviewView[] = ['dashboard', 'activity', 'goals'];
export function isOverviewView(value: string): value is OverviewView {
  return overviewViews.includes(value as OverviewView);
}

export const goalTypeLabels: Record<WritingGoalType, string> = {
  word_count: 'Palavras da obra',
  chapter_count: 'Capítulos escritos',
  deadline: 'Prazo editorial',
};

