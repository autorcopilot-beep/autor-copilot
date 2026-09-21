alter table public.extension_catalog
  add column if not exists product_kind text not null default 'extension',
  add column if not exists media_url text not null default '',
  add column if not exists media_type text not null default 'none';

alter table public.extension_catalog
  drop constraint if exists extension_catalog_product_kind_check,
  add constraint extension_catalog_product_kind_check
    check (product_kind in ('extension', 'plugin', 'connector')),
  drop constraint if exists extension_catalog_media_type_check,
  add constraint extension_catalog_media_type_check
    check (media_type in ('none', 'gif', 'mp4'));

alter table public.extension_catalog
  drop column if exists rating,
  drop column if exists install_count;

comment on column public.extension_catalog.product_kind is
  'Marketplace section: extension, plugin or connector.';
comment on column public.extension_catalog.media_url is
  'Public GIF/MP4 URL or application path used in the detailed preview drawer.';
