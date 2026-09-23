insert into public.product_guides (
  guide_key, name, description, experience_type, route_pattern,
  enabled, new_users_only, priority, version, settings
)
values (
  'account.preferences-hub',
  'Sua experiência, em um só lugar',
  'Apresenta a nova central de escrita, aparência, privacidade, IA e orientações.',
  'coach_mark',
  '/account/preferences',
  true,
  false,
  25,
  1,
  '{"maxAgeDays":3650}'::jsonb
)
on conflict (guide_key) do nothing;

insert into public.product_guide_steps (
  guide_id, position, selector, title, message, placement, animation, action_label
)
select id, 0, '[data-tour="account-preferences"]',
  'Preferências agora vivem juntas',
  'Ajuste escrita, aparência, notificações, privacidade, IA e tours. As escolhas visuais são aplicadas na hora e salvas na nuvem.',
  'left', 'spotlight', 'Explorar preferências'
from public.product_guides
where guide_key = 'account.preferences-hub'
on conflict (guide_id, position) do nothing;
