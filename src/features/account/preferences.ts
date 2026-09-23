import type { Json } from '@/types/database.generated';

export type AccountPreferences = {
  writing: { dailyGoal: number; autosave: boolean; spellcheck: boolean; openLastWork: boolean; focusMode: boolean; pagePreset: 'continuous' | 'book' | 'a4' };
  appearance: { theme: 'system' | 'light' | 'dark'; fontSize: number; lineHeight: 1.5 | 1.65 | 1.8; textWidth: 60 | 68 | 75; reduceMotion: boolean; highContrast: boolean };
  notifications: { inApp: boolean; emailMentions: boolean; emailReminders: boolean; goalReminders: boolean; collaboration: boolean; security: boolean };
  communications: { productUpdates: boolean; editorialDigest: boolean; researchInvites: boolean; changelog: boolean };
  privacy: { usageMetadata: boolean; personalizedRecommendations: boolean; publicProfile: boolean; compatibilityDiscovery: boolean; proseAnalysisConsent: boolean };
  ai: { enabled: boolean; useEncyclopedia: boolean; useCurrentChapter: boolean; useOtherWorks: boolean; rememberInstructions: boolean };
  guidance: { enabled: boolean; hotspots: boolean; announcements: boolean };
};

export const defaultAccountPreferences: AccountPreferences = {
  writing: { dailyGoal: 1000, autosave: true, spellcheck: true, openLastWork: true, focusMode: false, pagePreset: 'book' },
  appearance: { theme: 'system', fontSize: 19, lineHeight: 1.65, textWidth: 68, reduceMotion: false, highContrast: false },
  notifications: { inApp: true, emailMentions: true, emailReminders: true, goalReminders: false, collaboration: true, security: true },
  communications: { productUpdates: true, editorialDigest: false, researchInvites: false, changelog: true },
  privacy: { usageMetadata: true, personalizedRecommendations: true, publicProfile: false, compatibilityDiscovery: false, proseAnalysisConsent: false },
  ai: { enabled: true, useEncyclopedia: true, useCurrentChapter: true, useOtherWorks: false, rememberInstructions: true },
  guidance: { enabled: true, hotspots: true, announcements: true },
};

function object(value: Json | null | undefined) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, Json | undefined> : {};
}

function bool(value: Json | undefined, fallback: boolean) { return typeof value === 'boolean' ? value : fallback; }
function choice<T extends string | number>(value: Json | undefined, values: readonly T[], fallback: T) { return values.includes(value as T) ? value as T : fallback; }
function number(value: Json | undefined, fallback: number, min: number, max: number) { const parsed = Number(value); return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback; }

export function parseAccountPreferences(row?: Partial<Record<keyof AccountPreferences, Json>> | null): AccountPreferences {
  const writing = object(row?.writing); const appearance = object(row?.appearance); const notifications = object(row?.notifications);
  const communications = object(row?.communications); const privacy = object(row?.privacy); const ai = object(row?.ai); const guidance = object(row?.guidance);
  return {
    writing: { dailyGoal: number(writing.dailyGoal, 1000, 0, 100000), autosave: bool(writing.autosave, true), spellcheck: bool(writing.spellcheck, true), openLastWork: bool(writing.openLastWork, true), focusMode: bool(writing.focusMode, false), pagePreset: choice(writing.pagePreset, ['continuous', 'book', 'a4'] as const, 'book') },
    appearance: { theme: choice(appearance.theme, ['system', 'light', 'dark'] as const, 'system'), fontSize: number(appearance.fontSize, 19, 16, 24), lineHeight: choice(appearance.lineHeight, [1.5, 1.65, 1.8] as const, 1.65), textWidth: choice(appearance.textWidth, [60, 68, 75] as const, 68), reduceMotion: bool(appearance.reduceMotion, false), highContrast: bool(appearance.highContrast, false) },
    notifications: { inApp: bool(notifications.inApp, true), emailMentions: bool(notifications.emailMentions, true), emailReminders: bool(notifications.emailReminders, true), goalReminders: bool(notifications.goalReminders, false), collaboration: bool(notifications.collaboration, true), security: bool(notifications.security, true) },
    communications: { productUpdates: bool(communications.productUpdates, true), editorialDigest: bool(communications.editorialDigest, false), researchInvites: bool(communications.researchInvites, false), changelog: bool(communications.changelog, true) },
    privacy: { usageMetadata: bool(privacy.usageMetadata, true), personalizedRecommendations: bool(privacy.personalizedRecommendations, true), publicProfile: bool(privacy.publicProfile, false), compatibilityDiscovery: bool(privacy.compatibilityDiscovery, false), proseAnalysisConsent: bool(privacy.proseAnalysisConsent, false) },
    ai: { enabled: bool(ai.enabled, true), useEncyclopedia: bool(ai.useEncyclopedia, true), useCurrentChapter: bool(ai.useCurrentChapter, true), useOtherWorks: bool(ai.useOtherWorks, false), rememberInstructions: bool(ai.rememberInstructions, true) },
    guidance: { enabled: bool(guidance.enabled, true), hotspots: bool(guidance.hotspots, true), announcements: bool(guidance.announcements, true) },
  };
}
