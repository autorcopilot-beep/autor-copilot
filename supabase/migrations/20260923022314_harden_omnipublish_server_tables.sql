create policy "Server only communication campaigns"
  on public.communication_campaigns for all to anon, authenticated
  using (false) with check (false);
create policy "Server only communication items"
  on public.communication_items for all to anon, authenticated
  using (false) with check (false);
create policy "Server only delivery attempts"
  on public.communication_delivery_attempts for all to anon, authenticated
  using (false) with check (false);
create policy "Server only communication components"
  on public.communication_components for all to anon, authenticated
  using (false) with check (false);
create policy "Server only communication media metadata"
  on public.communication_media_assets for all to anon, authenticated
  using (false) with check (false);
create policy "Server only communication API keys"
  on public.communication_api_keys for all to anon, authenticated
  using (false) with check (false);

create index communication_campaigns_created_by_idx on public.communication_campaigns (created_by) where created_by is not null;
create index communication_campaigns_updated_by_idx on public.communication_campaigns (updated_by) where updated_by is not null;
create index communication_items_created_by_idx on public.communication_items (created_by) where created_by is not null;
create index communication_items_updated_by_idx on public.communication_items (updated_by) where updated_by is not null;
create index communication_delivery_campaign_idx on public.communication_delivery_attempts (campaign_id);
create index communication_components_created_by_idx on public.communication_components (created_by) where created_by is not null;
create index communication_components_updated_by_idx on public.communication_components (updated_by) where updated_by is not null;
create index communication_media_assets_created_by_idx on public.communication_media_assets (created_by) where created_by is not null;
create index communication_api_keys_created_by_idx on public.communication_api_keys (created_by) where created_by is not null;
