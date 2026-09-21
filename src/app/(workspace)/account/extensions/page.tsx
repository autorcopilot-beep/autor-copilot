import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { extensionCatalog, type ExtensionId } from '@/features/extensions/catalog';
import { Marketplace, type MarketplaceControl } from '@/features/extensions/components/marketplace';
import { activeEntitlementIds } from '@/features/extensions/entitlements';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Extensões, plugins e conectores',
  description: 'Gerencie recursos modulares e conexões do Autor Copilot.',
};

function rolloutBucket(userId: string, flag: string) {
  return Array.from(`${userId}:${flag}`).reduce((total, character) => (total * 31 + character.charCodeAt(0)) % 100, 0);
}

export default async function ExtensionsPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect('/login?next=/account/extensions');
  const [catalogResult, accessResult, flagsResult, installationsResult, entitlementsResult] = await Promise.all([
    supabase.from('extension_catalog').select('id, product_kind, price_model, price_cents, currency, tags, media_url, media_type, allowed_groups, feature_flag').eq('is_published', true),
    supabase.from('user_access_profiles').select('groups, status').eq('user_id', userId).maybeSingle(),
    supabase.from('feature_flags').select('key, enabled, rollout_percentage, allowed_groups'),
    supabase.from('user_extension_installations').select('extension_id, is_active').eq('user_id', userId),
    supabase.from('user_extension_entitlements').select('extension_id, status, starts_at, ends_at').eq('user_id', userId),
  ]);
  const groups = accessResult.data?.groups?.length ? accessResult.data.groups : ['free'];
  const flags = new Map((flagsResult.data ?? []).map((flag) => [flag.key, flag]));
  const knownIds = new Set(extensionCatalog.map((extension) => extension.id));
  const entitlements = activeEntitlementIds(entitlementsResult.data ?? []);
  const controls = catalogResult.error ? undefined : (catalogResult.data ?? []).filter((extension) => {
    if (!knownIds.has(extension.id as ExtensionId) || !extension.allowed_groups.some((group) => groups.includes(group))) return false;
    if (!extension.feature_flag) return true;
    const flag = flags.get(extension.feature_flag);
    return Boolean(flag?.enabled && flag.allowed_groups.some((group) => groups.includes(group)) && rolloutBucket(userId, flag.key) < flag.rollout_percentage);
  }).map((extension): MarketplaceControl => {
    const acquired = extension.price_model === 'free'
      || (extension.price_model === 'pro_included' && groups.includes('pro'))
      || entitlements.has(extension.id);
    return { id: extension.id as ExtensionId, productKind: extension.product_kind, priceModel: extension.price_model, priceCents: extension.price_cents, currency: extension.currency, tags: extension.tags, mediaUrl: extension.media_url, mediaType: extension.media_type, acquired, canInstall: acquired && accessResult.data?.status !== 'suspended' };
  });
  const installationState = Object.fromEntries((installationsResult.data ?? []).filter((item) => knownIds.has(item.extension_id as ExtensionId)).map((item) => [item.extension_id, item.is_active]));
  return <Marketplace controls={controls} installationState={installationState} catalogBacked={!catalogResult.error} />;
}
