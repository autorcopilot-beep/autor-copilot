const allowedAuthDestinations = new Set([
  '/dashboard',
  '/onboarding',
  '/update-password',
  '/admin',
  '/account/login',
  '/library/all',
  '/library/recent',
  '/library/favorites',
  '/library/archived',
  '/library/catalogs',
  '/overview/dashboard',
  '/overview/activity',
  '/overview/goals',
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
    const catalogDestination = /^\/library\/catalogs\/[0-9a-f-]{36}$/i.test(destination.pathname);
    if (destination.origin !== 'https://autorcopilot.local' || (!allowedAuthDestinations.has(destination.pathname) && !catalogDestination)) {
      return fallback;
    }
    if (destination.pathname === '/write/editor') {
      const workId = destination.searchParams.get('work');
      const documentId = destination.searchParams.get('document');
      const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const safeParams = new URLSearchParams();
      if (workId && uuid.test(workId)) safeParams.set('work', workId);
      if (documentId && uuid.test(documentId)) safeParams.set('document', documentId);
      if (safeParams.size) return `${destination.pathname}?${safeParams}`;
    }
    return destination.pathname;
  } catch {
    return fallback;
  }
}
