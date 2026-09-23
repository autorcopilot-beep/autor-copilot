update public.product_guide_steps step
set selector = '[data-tour="writing-navigation"]',
    title = 'Som e foco ficam sempre por perto',
    message = 'Abra a cápsula de navegação quando quiser acessar paisagens sonoras, playlists e pomodoro sem abandonar a obra.'
from public.product_guides guide
where guide.id = step.guide_id
  and guide.guide_key = 'sound.focus-mixer'
  and step.position = 0;
