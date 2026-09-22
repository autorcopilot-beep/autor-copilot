export type ExtensionEntitlementWindow = {
  extension_id: string;
  status: string;
  starts_at: string;
  ends_at: string | null;
};

export function activeEntitlementIds(rows: ExtensionEntitlementWindow[]) {
  const now = Date.now();
  return new Set(rows.filter((entitlement) => entitlement.status === 'active'
    && new Date(entitlement.starts_at).getTime() <= now
    && (!entitlement.ends_at || new Date(entitlement.ends_at).getTime() > now))
    .map((entitlement) => entitlement.extension_id));
}
