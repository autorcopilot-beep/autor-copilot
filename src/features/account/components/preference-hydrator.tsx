'use client';

import { useEffect, useMemo } from 'react';

import { parseAccountPreferences } from '@/features/account/preferences';
import { applyAccessibilityPreferences, saveAccessibilityPreferences } from '@/features/accessibility/preferences';
import { createClient } from '@/lib/supabase/client';

export function PreferenceHydrator() {
  const supabase = useMemo(() => createClient(), []);
  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      const { data: claims } = await supabase.auth.getClaims();
      const userId = claims?.claims?.sub;
      if (!userId) return;
      const { data } = await supabase.from('user_preferences').select('appearance').eq('user_id', userId).maybeSingle();
      if (cancelled || !data) return;
      const appearance = parseAccountPreferences(data).appearance;
      applyAccessibilityPreferences(appearance);
      saveAccessibilityPreferences(appearance);
    }
    void hydrate();
    return () => { cancelled = true; };
  }, [supabase]);
  return null;
}
