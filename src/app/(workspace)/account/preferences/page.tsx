import { redirect } from 'next/navigation';

import { PreferencesForm } from '@/features/account/components/preferences-form';
import { parseAccountPreferences } from '@/features/account/preferences';
import { createClient } from '@/lib/supabase/server';

export default async function AccountPreferencesPage({ searchParams }: { searchParams: Promise<{ saved?: string; reset?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect('/login?next=/account/preferences');
  const { data } = await supabase.from('user_preferences').select('writing,appearance,notifications,communications,privacy,ai,guidance').eq('user_id', userId).maybeSingle();
  return <div><div className="mb-6"><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">Tudo no seu ritmo</p><h1 className="mt-2 font-serif text-3xl font-semibold text-ink">Preferências</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Uma central para adaptar escrita, aparência, comunicações, privacidade e assistência sem espalhar decisões por várias telas.</p></div><PreferencesForm initial={parseAccountPreferences(data)} saved={params.saved === '1'} reset={params.reset === '1'} /></div>;
}
