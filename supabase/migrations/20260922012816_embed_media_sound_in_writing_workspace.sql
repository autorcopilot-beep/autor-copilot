update public.extension_catalog
set
  version = '1.1.0',
  description = 'Atmosferas oficiais, acervo sonoro e mixer integrado diretamente ao ambiente de escrita.',
  tags = array['Áudio', 'Foco', 'Paisagens sonoras', 'Audiolivro'],
  config = coalesce(config, '{}'::jsonb) || '{"route":"/write/editor?sound=open","nativeLayers":9,"officialPresets":6}'::jsonb,
  updated_at = now()
where id = 'lab.media-sound';
