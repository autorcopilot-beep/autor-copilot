export const CONSENT_COOKIE = 'ac_cookie_consent';
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;
export type OptionalCategory = 'preferences' | 'analytics' | 'marketing';
export type Consent = { version: number; necessary: true; preferences: boolean; analytics: boolean; marketing: boolean; updatedAt: number };
export function makeConsent(choices: Record<OptionalCategory, boolean>, now = Date.now()): Consent {
  return { version: CONSENT_VERSION, necessary: true, preferences: choices.preferences, analytics: choices.analytics, marketing: choices.marketing, updatedAt: now };
}
export function parseConsent(value: string | undefined, now = Date.now()): Consent | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    if (parsed.version !== CONSENT_VERSION || parsed.necessary !== true || !Number.isFinite(parsed.updatedAt) || parsed.updatedAt > now || now - parsed.updatedAt >= CONSENT_MAX_AGE * 1000) return null;
    if (['preferences', 'analytics', 'marketing'].some((key) => typeof parsed[key] !== 'boolean')) return null;
    return makeConsent(parsed, parsed.updatedAt);
  } catch { return null; }
}
export function readConsent(): Consent | null {
  if (typeof document === 'undefined') return null;
  return parseConsent(document.cookie.split('; ').find((part) => part.startsWith(`${CONSENT_COOKIE}=`))?.slice(CONSENT_COOKIE.length + 1));
}
export function allowsConsent(category: OptionalCategory): boolean {
  return readConsent()?.[category] === true;
}
