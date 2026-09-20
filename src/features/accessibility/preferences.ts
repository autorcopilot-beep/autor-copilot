export const ACCESSIBILITY_STORAGE_KEY = 'autor-copilot:accessibility';

export const themeOptions = ['system', 'light', 'dark'] as const;
export const lineHeightOptions = [1.5, 1.65, 1.8] as const;
export const textWidthOptions = [60, 68, 75] as const;

export type ThemePreference = (typeof themeOptions)[number];
export type LineHeightPreference = (typeof lineHeightOptions)[number];
export type TextWidthPreference = (typeof textWidthOptions)[number];

export type AccessibilityPreferences = {
  theme: ThemePreference;
  fontSize: number;
  lineHeight: LineHeightPreference;
  textWidth: TextWidthPreference;
  reduceMotion: boolean;
};

export const defaultAccessibilityPreferences: AccessibilityPreferences = {
  theme: 'system',
  fontSize: 19,
  lineHeight: 1.65,
  textWidth: 68,
  reduceMotion: false,
};

function isIncluded<T extends readonly unknown[]>(
  options: T,
  value: unknown,
): value is T[number] {
  return options.includes(value);
}

export function parseAccessibilityPreferences(
  value: unknown,
): AccessibilityPreferences {
  if (!value || typeof value !== 'object') {
    return defaultAccessibilityPreferences;
  }

  const candidate = value as Partial<AccessibilityPreferences>;
  const numericFontSize = Number(candidate.fontSize);

  return {
    theme: isIncluded(themeOptions, candidate.theme)
      ? candidate.theme
      : defaultAccessibilityPreferences.theme,
    fontSize: Number.isFinite(numericFontSize)
      ? Math.min(24, Math.max(16, Math.round(numericFontSize)))
      : defaultAccessibilityPreferences.fontSize,
    lineHeight: isIncluded(lineHeightOptions, candidate.lineHeight)
      ? candidate.lineHeight
      : defaultAccessibilityPreferences.lineHeight,
    textWidth: isIncluded(textWidthOptions, candidate.textWidth)
      ? candidate.textWidth
      : defaultAccessibilityPreferences.textWidth,
    reduceMotion:
      typeof candidate.reduceMotion === 'boolean'
        ? candidate.reduceMotion
        : defaultAccessibilityPreferences.reduceMotion,
  };
}

export function applyAccessibilityPreferences(
  preferences: AccessibilityPreferences,
) {
  const root = document.documentElement;

  if (preferences.theme === 'system') {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = preferences.theme;
  }

  if (preferences.reduceMotion) {
    root.dataset.reduceMotion = 'true';
  } else {
    delete root.dataset.reduceMotion;
  }

  root.style.setProperty('--editor-font-size', `${preferences.fontSize / 16}rem`);
  root.style.setProperty('--editor-line-height', String(preferences.lineHeight));
  root.style.setProperty('--manuscript-width', `${preferences.textWidth}ch`);
}

export function readAccessibilityPreferences(): AccessibilityPreferences {
  if (typeof window === 'undefined') {
    return defaultAccessibilityPreferences;
  }

  try {
    const stored = window.localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
    return parseAccessibilityPreferences(stored ? JSON.parse(stored) : null);
  } catch {
    return defaultAccessibilityPreferences;
  }
}

export function saveAccessibilityPreferences(
  preferences: AccessibilityPreferences,
) {
  try {
    window.localStorage.setItem(
      ACCESSIBILITY_STORAGE_KEY,
      JSON.stringify(preferences),
    );
  } catch {
    // As preferências continuam válidas nesta aba quando o armazenamento está
    // indisponível (modo privado, política do navegador ou cota excedida).
  }
}
