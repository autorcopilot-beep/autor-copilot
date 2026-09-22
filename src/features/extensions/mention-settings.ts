export const mentionExtensionStorageKey = 'autor-copilot:extensions';

export type MentionAppearance = 'highlighted' | 'plain' | 'underline' | 'pill';
export type MentionSuggestionView = 'compact' | 'rich';

export type MentionExtensionSettings = {
  enabled: boolean;
  appearance: MentionAppearance;
  verifyReferences: boolean;
  showCounts: boolean;
  showMetadata: boolean;
  openContextOnClick: boolean;
  hoverPreview: boolean;
  searchAliases: boolean;
  groupByType: boolean;
  prioritizePinned: boolean;
  showCanonStatus: boolean;
  warnSpoilers: boolean;
  suggestionView: MentionSuggestionView;
};

export const defaultMentionExtensionSettings: MentionExtensionSettings = {
  enabled: true,
  appearance: 'highlighted',
  verifyReferences: true,
  showCounts: true,
  showMetadata: true,
  openContextOnClick: true,
  hoverPreview: true,
  searchAliases: true,
  groupByType: true,
  prioritizePinned: true,
  showCanonStatus: true,
  warnSpoilers: true,
  suggestionView: 'rich',
};

export function parseMentionExtensionSettings(value: string | null): MentionExtensionSettings {
  if (!value) return defaultMentionExtensionSettings;
  try {
    const parsed = JSON.parse(value) as Partial<MentionExtensionSettings> & { mentions?: boolean };
    return {
      enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : parsed.mentions !== false,
      appearance: ['plain', 'underline', 'pill'].includes(String(parsed.appearance)) ? parsed.appearance as MentionAppearance : 'highlighted',
      verifyReferences: parsed.verifyReferences !== false,
      showCounts: parsed.showCounts !== false,
      showMetadata: parsed.showMetadata !== false,
      openContextOnClick: parsed.openContextOnClick !== false,
      hoverPreview: parsed.hoverPreview !== false,
      searchAliases: parsed.searchAliases !== false,
      groupByType: parsed.groupByType !== false,
      prioritizePinned: parsed.prioritizePinned !== false,
      showCanonStatus: parsed.showCanonStatus !== false,
      warnSpoilers: parsed.warnSpoilers !== false,
      suggestionView: parsed.suggestionView === 'compact' ? 'compact' : 'rich',
    };
  } catch {
    return defaultMentionExtensionSettings;
  }
}
