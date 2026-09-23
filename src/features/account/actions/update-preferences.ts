'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { defaultAccountPreferences } from '@/features/account/preferences';
import { createClient } from '@/lib/supabase/server';

function checked(formData: FormData, name: string) { return formData.get(name) === 'on'; }
function selected<T extends string>(formData: FormData, name: string, options: readonly T[], fallback: T): T { const value = String(formData.get(name) ?? ''); return options.includes(value as T) ? value as T : fallback; }
function numeric(formData: FormData, name: string, fallback: number, min: number, max: number) { const value = Number(formData.get(name)); return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback; }

export async function updateAccountPreferences(formData: FormData) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect('/login?next=/account/preferences');

  const preferences = {
    writing: { dailyGoal: numeric(formData, 'dailyGoal', 1000, 0, 100000), autosave: checked(formData, 'autosave'), spellcheck: checked(formData, 'spellcheck'), openLastWork: checked(formData, 'openLastWork'), focusMode: checked(formData, 'focusMode'), pagePreset: selected(formData, 'pagePreset', ['continuous', 'book', 'a4'] as const, 'book') },
    appearance: { theme: selected(formData, 'theme', ['system', 'light', 'dark'] as const, 'system'), fontSize: numeric(formData, 'fontSize', 19, 16, 24), lineHeight: Number(selected(formData, 'lineHeight', ['1.5', '1.65', '1.8'] as const, '1.65')), textWidth: Number(selected(formData, 'textWidth', ['60', '68', '75'] as const, '68')), reduceMotion: checked(formData, 'reduceMotion'), highContrast: checked(formData, 'highContrast') },
    notifications: { inApp: checked(formData, 'inApp'), emailMentions: checked(formData, 'emailMentions'), emailReminders: checked(formData, 'emailReminders'), goalReminders: checked(formData, 'goalReminders'), collaboration: checked(formData, 'collaboration'), security: checked(formData, 'security') },
    communications: { productUpdates: checked(formData, 'productUpdates'), editorialDigest: checked(formData, 'editorialDigest'), researchInvites: checked(formData, 'researchInvites'), changelog: checked(formData, 'changelog') },
    privacy: { usageMetadata: checked(formData, 'usageMetadata'), personalizedRecommendations: checked(formData, 'personalizedRecommendations'), publicProfile: checked(formData, 'publicProfile'), compatibilityDiscovery: checked(formData, 'compatibilityDiscovery'), proseAnalysisConsent: checked(formData, 'proseAnalysisConsent') },
    ai: { enabled: checked(formData, 'aiEnabled'), useEncyclopedia: checked(formData, 'useEncyclopedia'), useCurrentChapter: checked(formData, 'useCurrentChapter'), useOtherWorks: checked(formData, 'useOtherWorks'), rememberInstructions: checked(formData, 'rememberInstructions') },
    guidance: { enabled: checked(formData, 'guidanceEnabled'), hotspots: checked(formData, 'hotspots'), announcements: checked(formData, 'announcements') },
  };
  const { error } = await supabase.from('user_preferences').upsert({ user_id: userId, ...preferences }, { onConflict: 'user_id' });
  if (error) throw new Error('Não foi possível salvar suas preferências agora.');
  revalidatePath('/account/preferences');
  revalidatePath('/', 'layout');
  redirect('/account/preferences?saved=1');
}

export async function resetAccountPreferences() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect('/login?next=/account/preferences');
  const { error } = await supabase.from('user_preferences').upsert({ user_id: userId, ...defaultAccountPreferences }, { onConflict: 'user_id' });
  if (error) throw new Error('Não foi possível restaurar as preferências.');
  revalidatePath('/account/preferences');
  redirect('/account/preferences?reset=1');
}
