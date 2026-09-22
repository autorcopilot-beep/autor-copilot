export const mentionExtensionStorageKey = 'autor-copilot:extensions';

export type MentionAppearance = 'highlighted' | 'plain';

export type MentionExtensionSettings = {
  enabled: boolean;
  appearance: MentionAppearance;
  verifyReferences: boolean;
  showCounts: boolean;
  showMetadata: boolean;
  openContextOnClick: boolean;
};

export const defaultMentionExtensionSettings: MentionExtensionSettings = {
  enabled: true,
  appearance: 'highlighted',
  verifyReferences: true,
  showCounts: true,
  showMetadata: true,
  openContextOnClick: true,
};

export function parseMentionExtensionSettings(value: string | null): MentionExtensionSettings {
  if (!value) return defaultMentionExtensionSettings;
  try {
    const parsed = JSON.parse(value) as Partial<MentionExtensionSettings> & { mentions?: boolean };
    return {
      enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : parsed.mentions !== false,
      appearance: parsed.appearance === 'plain' ? 'plain' : 'highlighted',
      verifyReferences: parsed.verifyReferences !== false,
      showCounts: parsed.showCounts !== false,
      showMetadata: parsed.showMetadata !== false,
      openContextOnClick: parsed.openContextOnClick !== false,
    };
  } catch {
    return defaultMentionExtensionSettings;
  }
}
