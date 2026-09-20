const allowedAuthDestinations = new Set([
  '/dashboard',
  '/onboarding',
  '/update-password',
  '/admin',
  '/account/login',
  '/write',
  '/write/editor',
  '/write/chapters',
  '/write/scenes',
  '/write/notes',
]);

export function getSafeAuthDestination(value: string | null | undefined, fallback: string) {
  if (!value) return fallback;
  try {
    const destination = new URL(value, 'https://autorcopilot.local');
    if (destination.origin !== 'https://autorcopilot.local' || !allowedAuthDestinations.has(destination.pathname)) {
      return fallback;
    }
    if (destination.pathname === '/write/editor') {
      const documentId = destination.searchParams.get('document');
      if (documentId && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(documentId)) {
        return `${destination.pathname}?document=${documentId}`;
      }
    }
    return destination.pathname;
  } catch {
    return fallback;
  }
}
