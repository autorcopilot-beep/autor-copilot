const allowedAuthDestinations = new Set(['/dashboard', '/onboarding', '/update-password']);

export function getSafeAuthDestination(value: string | null | undefined, fallback: string) {
  return value && allowedAuthDestinations.has(value) ? value : fallback;
}
