#!/usr/bin/env bash
set -Eeuo pipefail

# Execute no Git Bash, dentro de C:/Users/Dell/Documents/autor-copilot.
if [[ ! -d images/logos || ! -d images/favicon ]]; then
  echo 'Execute na raiz autor-copilot, com images/logos e images/favicon.' >&2
  exit 1
fi
if [[ -e package.json || -e src || -e public ]]; then
  echo 'Projeto já inicializado (package.json, src ou public existe). Nenhum arquivo foi alterado.' >&2
  exit 1
fi
if ! command -v node >/dev/null || ! command -v npm >/dev/null; then
  echo 'Instale Node.js e npm antes de continuar.' >&2
  exit 1
fi
node -e 'const v=process.versions.node.split(".").map(Number); if(v[0]<20 || (v[0]===20 && v[1]<9)){console.error("Node.js 20.9+ necessário; encontrado "+process.version);process.exit(1)}'

# create-next-app recusa pastas não vazias; gerar em diretório isolado e copiar só o scaffold.
scaffold_parent="$(mktemp -d "${TMPDIR:-/tmp}/autor-copilot-bootstrap.XXXXXX")"
trap 'rm -rf "$scaffold_parent"' EXIT
scaffold_dir="$scaffold_parent/autor-copilot"
npm_config_yes=true npx create-next-app@latest "$scaffold_dir" --typescript --eslint --app --src-dir --no-tailwind --use-npm --import-alias '@/*' --skip-install --disable-git --no-agents-md --yes
for scaffold_item in "$scaffold_dir"/* "$scaffold_dir"/.[!.]*; do
  [[ -e "$scaffold_item" ]] || continue
  if [[ -e "${scaffold_item##*/}" ]]; then
    echo "Arquivo já existente na raiz: ${scaffold_item##*/}. Nenhum arquivo será substituído." >&2
    exit 1
  fi
done
cp -R "$scaffold_dir"/. .
npm install
npm install --save-dev --save-exact tailwindcss@3.4.1
npm install --save-dev postcss autoprefixer
npm install lucide-react
mkdir -p public/images src/components/{layout,ui,editor} src/features/{auth,projects,manuscript,characters,timeline,analysis} src/{lib,styles,types,hooks} src/app/'(site)' src/app/'(auth)' src/app/'(workspace)' docs
cp -R images/. public/images/

cat > tailwind.config.ts <<'EOF'
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-canvas)',
        editor: 'var(--color-editor)',
        surface: 'var(--color-surface)',
        ink: 'var(--color-text)',
        muted: 'var(--color-text-secondary)',
        line: 'var(--color-border)',
        accent: 'var(--color-accent)',
        'accent-subtle': 'var(--color-accent-subtle)',
        'on-accent': 'var(--color-on-accent)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-literata)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
EOF
cat > postcss.config.mjs <<'EOF'
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
EOF
# create-next-app pode criar seu próprio arquivo PostCSS; deixar apenas um.
rm -f postcss.config.js
cat > src/app/globals.css <<'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-editor: #FAFAF7;
  --color-canvas: #F1F2EF;
  --color-surface: #FFFFFF;
  --color-text: #292B29;
  --color-text-secondary: #666B66;
  --color-border: #E2E5E0;
  --color-accent: #356B55;
  --color-accent-subtle: #E5EFE8;
  --color-on-accent: #FFFFFF;
}
@media (prefers-color-scheme: dark) {
  :root {
    --color-editor: #1B1D1B;
    --color-canvas: #171917;
    --color-surface: #242724;
    --color-text: #E7EAE5;
    --color-text-secondary: #AEB8B0;
    --color-border: #343A35;
    --color-accent: #9BC8AA;
    --color-accent-subtle: #263A2D;
    --color-on-accent: #1B1D1B;
  }
}
body { background: var(--color-canvas); color: var(--color-text); }
::selection { background: var(--color-accent-subtle); }
EOF

# Não presumir extensão dos arquivos do usuário; descobrir um isologo existente.
brand_image=''
for ext in svg png webp jpg jpeg; do
  if [[ -f "public/images/logos/isologo-color-bgwhite.$ext" ]]; then
    brand_image="/images/logos/isologo-color-bgwhite.$ext"
    break
  fi
done
printf 'export const brandImage = "%s";\n' "$brand_image" > src/lib/brand-image.ts
favicon_image=''
for candidate in favicon.ico favicon.png icon.png favicon.svg icon.svg; do
  if [[ -f "public/images/favicon/$candidate" ]]; then
    favicon_image="/images/favicon/$candidate"
    break
  fi
done
printf 'export const faviconImage = "%s";\n' "$favicon_image" > src/lib/favicon-image.ts
cat > src/app/layout.tsx <<'EOF'
import type { Metadata } from 'next';
import { Inter, Literata } from 'next/font/google';
import './globals.css';
import { faviconImage } from '@/lib/favicon-image';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const literata = Literata({ subsets: ['latin'], variable: '--font-literata', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Autor Copilot', template: '%s | Autor Copilot' },
  description: 'Seu espaço para escrever e organizar histórias.',
  ...(faviconImage ? { icons: { icon: faviconImage } } : {}),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${inter.variable} ${literata.variable} font-sans antialiased`}>{children}</body></html>;
}
EOF
cat > src/app/page.tsx <<'EOF'
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpenText } from 'lucide-react';
import { brandImage } from '@/lib/brand-image';

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-12">
      <header className="mx-auto flex max-w-6xl items-center justify-between rounded-xl border border-line bg-surface px-5 py-3">
        <div className="flex items-center gap-3">
          {brandImage ? <Image src={brandImage} alt="" width={32} height={32} className="h-8 w-8 object-contain" /> : <BookOpenText aria-hidden="true" className="h-7 w-7 text-accent" />}
          <span className="font-semibold tracking-tight">AUTOR COPILOT</span>
        </div>
        <span className="text-sm text-muted">Seu espaço de escrita</span>
      </header>
      <section className="mx-auto grid max-w-6xl gap-10 py-24 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-5 text-sm font-medium text-accent">Escrita e planejamento em um só lugar</p>
          <h1 className="max-w-xl font-serif text-5xl leading-tight md:text-6xl">Toda grande história merece espaço para crescer.</h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">O ponto de partida para escrever, planejar e organizar as histórias que você quer contar.</p>
          <Link href="#visao" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-5 py-3 font-medium text-on-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Conhecer a proposta <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
        <div id="visao" className="rounded-xl border border-line bg-editor p-8 shadow-sm md:p-12">
          <span className="text-sm text-muted">Manuscrito · Rascunho</span>
          <h2 className="mt-8 font-serif text-3xl">O primeiro capítulo</h2>
          <p className="mt-5 max-w-prose font-serif text-lg leading-[1.65]">Toda história começa com uma ideia. Aqui, cada cena encontra seu lugar, e cada personagem tem uma história para contar.</p>
        </div>
      </section>
    </main>
  );
}
EOF

for dir in src/components/{layout,ui,editor} src/features/{auth,projects,manuscript,characters,timeline,analysis} src/{styles,types,hooks} src/app/'(site)' src/app/'(auth)' src/app/'(workspace)'; do
  touch "$dir/.gitkeep"
done
cat > docs/ARQUITETURA_INICIAL.md <<'EOF'
# Autor Copilot — arquitetura inicial

- `src/app`: rotas Next.js; grupos `(site)`, `(auth)` e `(workspace)` preparados para páginas futuras. A página `/` é uma apresentação inicial.
- `src/components`: componentes reutilizáveis de layout, interface e editor.
- `src/features`: código organizado por domínio (conta, projetos, manuscrito, personagens, cronologia e análise).
- `src/lib`, `src/hooks`, `src/types`, `src/styles`: utilitários, hooks, tipos e estilos adicionais.
- `images`: arquivos originais informados pelo autor; `public/images`: cópia acessível pela aplicação, com favicon e logos.
- Cores e tipografia: `DESIGN.md`; Tailwind 3.4.1 em `tailwind.config.ts` e `src/app/globals.css`.

Ainda não há autenticação, banco de dados, editor persistente nem pagamentos; os diretórios representam os limites iniciais dos módulos.
EOF
# Apenas se existir favicon.ico original, substituir o favicon padrão gerado pelo Next.
if [[ -f public/images/favicon/favicon.ico ]]; then cp public/images/favicon/favicon.ico src/app/favicon.ico; else rm -f src/app/favicon.ico; fi
npx tsc --noEmit
npx eslint src
printf '\nConcluído. Inicie com: npm run dev\n'
