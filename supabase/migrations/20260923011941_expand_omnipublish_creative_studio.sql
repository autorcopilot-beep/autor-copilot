insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'omnipublish-media',
  'omnipublish-media',
  true,
  52428800,
  array['image/jpeg','image/png','image/webp','image/avif','image/gif','video/mp4','video/webm']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table public.communication_components (
  id uuid primary key default gen_random_uuid(),
  component_key text not null unique check (component_key ~ '^[a-z0-9][a-z0-9._-]{2,79}$'),
  name text not null check (char_length(name) between 2 and 120),
  category text not null check (category in ('hero','content','media','quote','cta','footer','motion','custom')),
  description text not null default '',
  html_code text not null default '',
  css_code text not null default '',
  js_code text not null default '',
  icon_name text not null default 'sparkles',
  version integer not null default 1 check (version > 0),
  is_official boolean not null default false,
  is_active boolean not null default true,
  config jsonb not null default '{}'::jsonb check (jsonb_typeof(config) = 'object'),
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.communication_media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  public_url text not null,
  file_name text not null,
  media_type text not null check (media_type in ('image','gif','video')),
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 52428800),
  title text not null default '',
  alt_text text not null default '',
  caption text not null default '',
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index communication_components_category_active_idx on public.communication_components (category, is_active, is_official desc);
create index communication_media_assets_created_idx on public.communication_media_assets (created_at desc);
create index communication_media_assets_type_idx on public.communication_media_assets (media_type, created_at desc);

alter table public.communication_components enable row level security;
alter table public.communication_media_assets enable row level security;
revoke all on table public.communication_components, public.communication_media_assets from anon, authenticated;

create trigger communication_components_set_updated_at before update on public.communication_components
  for each row execute procedure private.set_updated_at();

insert into public.communication_components
  (component_key, name, category, description, html_code, css_code, js_code, icon_name, is_official, config)
values
  (
    'official.editorial-hero',
    'Abertura editorial',
    'hero',
    'Hero com selo, título, resumo e ações.',
    '<header class="op-hero"><span class="op-kicker">Novidade no Autor Copilot</span><h1>Uma nova forma de escrever</h1><p>Contexto claro, ritmo editorial e espaço para a história.</p><div class="op-actions"><a href="#" class="op-button">Conhecer agora</a><a href="#" class="op-link">Ler as notas</a></div></header>',
    '.op-hero{padding:clamp(2.5rem,8vw,6rem);border-radius:28px;background:linear-gradient(135deg,#173f32,#356b55 60%,#a7c8b4);color:#fff}.op-kicker{font:700 .72rem/1 system-ui;letter-spacing:.16em;text-transform:uppercase}.op-hero h1{max-width:12ch;margin:1.2rem 0 .75rem;font:600 clamp(2.4rem,7vw,5.5rem)/.98 Georgia,serif}.op-hero p{max-width:42rem;font:400 1.08rem/1.7 system-ui;opacity:.82}.op-actions{display:flex;flex-wrap:wrap;gap:1rem;margin-top:2rem}.op-button,.op-link{padding:.8rem 1.1rem;border-radius:999px;font:600 .86rem system-ui;text-decoration:none}.op-button{background:#fff;color:#173f32}.op-link{border:1px solid #ffffff55;color:#fff}',
    '',
    'sparkles',
    true,
    '{"slots":["kicker","title","summary","primaryAction","secondaryAction"]}'::jsonb
  ),
  (
    'official.feature-grid',
    'Grade de novidades',
    'content',
    'Cards responsivos para resumir recursos de uma versão.',
    '<section class="op-grid"><article><span>01</span><h2>Contexto imediato</h2><p>Informação no ponto exato em que ela ajuda.</p></article><article><span>02</span><h2>Menos interrupções</h2><p>Fluxos rápidos e decisões mais simples.</p></article><article><span>03</span><h2>Controle editorial</h2><p>Versões, revisão e publicação rastreáveis.</p></article></section>',
    '.op-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin:2rem 0}.op-grid article{padding:1.4rem;border:1px solid #dfe5e0;border-radius:18px;background:#fff}.op-grid span{color:#356b55;font:700 .72rem system-ui}.op-grid h2{margin:.8rem 0 .5rem;font:600 1.2rem Georgia,serif}.op-grid p{color:#667068;font:400 .9rem/1.6 system-ui}',
    '',
    'layout-grid',
    true,
    '{"repeatable":true,"minItems":1,"maxItems":8}'::jsonb
  ),
  (
    'official.pull-quote',
    'Citação editorial',
    'quote',
    'Citação com autoria e tratamento editorial.',
    '<figure class="op-quote"><blockquote>“A ferramenta desaparece quando a história encontra seu ritmo.”</blockquote><figcaption>Equipe editorial · Autor Copilot</figcaption></figure>',
    '.op-quote{margin:3rem auto;max-width:46rem;padding:2rem;border-left:3px solid #356b55;background:#edf4ef}.op-quote blockquote{margin:0;font:500 clamp(1.35rem,4vw,2rem)/1.35 Georgia,serif;color:#243329}.op-quote figcaption{margin-top:1rem;color:#607066;font:600 .75rem system-ui;letter-spacing:.06em;text-transform:uppercase}',
    '',
    'quote',
    true,
    '{"slots":["quote","author"]}'::jsonb
  ),
  (
    'official.media-stage',
    'Palco de mídia',
    'media',
    'Imagem, GIF ou vídeo com legenda e controles.',
    '<figure class="op-media"><img src="https://placehold.co/1200x675/e5efe8/356b55?text=Selecione+uma+mídia" alt="Prévia editorial"><figcaption>Uma legenda curta que acrescenta contexto.</figcaption></figure>',
    '.op-media{margin:2.5rem 0}.op-media img,.op-media video{display:block;width:100%;border-radius:22px;box-shadow:0 20px 50px #173f3220}.op-media figcaption{margin:.75rem .5rem 0;color:#69726c;font:400 .78rem/1.5 system-ui}',
    '',
    'image',
    true,
    '{"accepts":["image","gif","video"],"slots":["media","alt","caption"]}'::jsonb
  ),
  (
    'official.reveal-motion',
    'Entrada em sequência',
    'motion',
    'Motion discreto acionado quando os elementos entram na tela.',
    '<section class="op-reveal"><p>Primeiro, clareza.</p><p>Depois, contexto.</p><p>Por fim, ação.</p></section>',
    '.op-reveal{display:grid;gap:1rem;margin:3rem 0}.op-reveal p{margin:0;padding:1rem 1.2rem;border-radius:14px;background:#e5efe8;font:600 1rem system-ui;opacity:0;transform:translateY(16px);transition:.6s cubic-bezier(.2,.8,.2,1)}.op-reveal p.is-visible{opacity:1;transform:none}@media(prefers-reduced-motion:reduce){.op-reveal p{opacity:1;transform:none;transition:none}}',
    'const nodes=[...document.querySelectorAll(".op-reveal p")];const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add("is-visible")}));nodes.forEach((node,index)=>{node.style.transitionDelay=(index*90)+"ms";observer.observe(node)});',
    'wand',
    true,
    '{"respectsReducedMotion":true}'::jsonb
  ),
  (
    'official.editorial-footer',
    'Rodapé editorial',
    'footer',
    'Encerramento com links, versão e assinatura da marca.',
    '<footer class="op-footer"><div><strong>Autor Copilot</strong><p>Ferramentas silenciosas para histórias vivas.</p></div><nav aria-label="Links desta publicação"><a href="#">Documentação</a><a href="#">Termos</a><a href="#">Suporte</a></nav><small>Versão 2.0 · Setembro de 2026</small></footer>',
    '.op-footer{display:grid;gap:1.5rem;margin-top:4rem;padding:2rem 0;border-top:1px solid #dfe5e0;color:#627067;font:400 .82rem/1.5 system-ui}.op-footer strong{color:#26342b;font:600 1.1rem Georgia,serif}.op-footer p{margin:.35rem 0}.op-footer nav{display:flex;flex-wrap:wrap;gap:1rem}.op-footer a{color:#356b55;text-decoration:none}.op-footer small{opacity:.75}',
    '',
    'footer',
    true,
    '{"slots":["brand","tagline","links","version"]}'::jsonb
  )
on conflict (component_key) do nothing;

comment on table public.communication_components is 'Reusable code-native blocks for OmniPublish HTML compositions.';
comment on table public.communication_media_assets is 'Metadata for OmniPublish images, GIFs and videos stored in Supabase Storage.';

