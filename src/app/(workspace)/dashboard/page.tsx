import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  Check,
  Feather,
  FileSearch,
  FolderKanban,
  Lightbulb,
  LockKeyhole,
  PenLine,
  Sparkles,
  Target,
  UserRound,
  UsersRound,
} from 'lucide-react';

import { Badge, buttonVariants } from '@/components/ui';
import { loadLibrary } from '@/features/library/server';
import { cn } from '@/lib/cn';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Mesa de escrita' };

const quickActions = [
  { label: 'Começar a escrever', description: 'Abra o editor no ponto em que parou.', icon: PenLine },
  { label: 'Planejar uma obra', description: 'Organize estrutura, cenas e enredo.', icon: FolderKanban },
  { label: 'Criar personagem', description: 'Registre voz, motivações e relações.', icon: UsersRound },
  { label: 'Guardar pesquisa', description: 'Reúna referências e fontes importantes.', icon: FileSearch },
] as const;

function QuickAction({ label, description, icon: Icon }: (typeof quickActions)[number]) {
  if (label === 'Começar a escrever') {
    return (
      <Link href="/write/editor" className="group flex min-h-20 w-full items-center gap-4 border-b border-line py-4 text-left transition-colors hover:bg-surface-muted last:border-b-0 sm:px-2">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent"><Icon className="size-4.5" aria-hidden="true" /></span>
        <span className="min-w-0 flex-1"><span className="block text-sm font-medium text-ink">{label}</span><span className="mt-0.5 block text-xs leading-relaxed text-muted">{description}</span></span>
        <ArrowRight className="size-3.5 shrink-0 text-accent transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
    );
  }
  return (
    <button type="button" disabled className="group flex min-h-20 w-full cursor-not-allowed items-center gap-4 border-b border-line py-4 text-left opacity-70 last:border-b-0 sm:px-2" aria-label={`${label}, em breve`} title="Em breve">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent"><Icon className="size-4.5" aria-hidden="true" /></span>
      <span className="min-w-0 flex-1"><span className="block text-sm font-medium text-ink">{label}</span><span className="mt-0.5 block text-xs leading-relaxed text-muted">{description}</span></span>
      <LockKeyhole className="size-3.5 shrink-0 text-muted" aria-hidden="true" />
    </button>
  );
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect('/login?next=/dashboard');

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, nickname, pen_name, writing_focus, experience_level, onboarding_completed_at')
    .eq('id', userId)
    .single();
  if (!profile?.onboarding_completed_at) redirect('/onboarding');

  const authorName = profile.pen_name || profile.nickname || profile.display_name;
  const dateLabel = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  const library = await loadLibrary(supabase, userId, 'recent');
  const lastWork = library.works[0];
  const writingHref = lastWork ? `/write/editor?work=${lastWork.id}` : '/write/editor';

  return (
    <div className="mx-auto w-full max-w-7xl py-4 sm:py-7">
      {status === 'ready' && <div className="auth-enter mb-5 flex items-center gap-3 rounded-control border border-success bg-success-subtle px-4 py-3 text-sm text-ink" role="status"><Check className="size-4 text-success" aria-hidden="true" />Seu perfil de escrita está pronto.</div>}

      <section className="auth-enter relative isolate min-h-[27rem] overflow-hidden rounded-card border border-line bg-editor shadow-soft sm:min-h-[29rem]" aria-labelledby="desk-title">
        <div className="absolute inset-0 -z-20 bg-[url('/images/kit_marca/03_backgrounds/papel-claro.svg')] bg-cover opacity-55 dark:opacity-10" />
        <div className="absolute -left-24 -top-32 -z-10 size-80 rounded-full bg-accent-subtle/70 blur-3xl" />
        <div className="relative z-10 flex min-h-[27rem] max-w-3xl flex-col justify-center p-6 pb-44 sm:min-h-[29rem] sm:p-10 sm:pb-40 lg:px-12 lg:py-12">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Mesa de escrita</Badge>
            <span className="text-xs capitalize text-muted">{dateLabel}</span>
          </div>
          <h1 id="desk-title" className="mt-6 max-w-2xl font-serif text-4xl font-semibold leading-[1.08] text-ink sm:text-5xl lg:text-6xl">Toda história começa com uma página, {authorName}.</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">Organize suas ideias, desenvolva seu universo e transforme o próximo rascunho em uma obra.</p>
          <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link href={writingHref} className={cn(buttonVariants({ size: 'wide' }))}><PenLine className="size-4" />{lastWork ? 'Continuar escrevendo' : 'Começar a escrever'}</Link>
            <Link href="/account/profile" className="inline-flex min-h-11 items-center gap-2 rounded-control px-3 text-sm font-medium text-ink transition-colors hover:bg-surface-muted"><UserRound className="size-4 text-accent" />Revisar meu perfil<ArrowRight className="size-3.5 text-muted" /></Link>
          </div>
          <p id="create-work-note" className="mt-2 text-xs text-muted"><Check className="mr-1 inline size-3 text-success" />Seus manuscritos são sincronizados com sua biblioteca.</p>
        </div>
        <div
          className="pointer-events-none absolute -bottom-14 -right-20 z-0 size-80 opacity-75 sm:-bottom-24 sm:-right-12 sm:size-[30rem] sm:opacity-85 xl:-bottom-32 xl:right-2 xl:size-[36rem]"
          style={{
            WebkitMaskImage: 'radial-gradient(circle at 54% 54%, #000 38%, rgb(0 0 0 / 0.92) 57%, transparent 79%)',
            maskImage: 'radial-gradient(circle at 54% 54%, #000 38%, rgb(0 0 0 / 0.92) 57%, transparent 79%)',
          }}
        >
          <Image src="/images/Aquarela_Literaria_Abas/02_png/dashboard.png" alt="" fill priority quality={88} sizes="(max-width: 600px) 320px, (max-width: 1280px) 480px, 576px" className="scale-105 object-contain mix-blend-multiply saturate-[0.92] contrast-[0.98] dark:mix-blend-screen dark:opacity-45" />
        </div>
      </section>

      <section className="auth-enter-delayed grid border-b border-line sm:grid-cols-3" aria-label="Resumo da mesa de escrita">
        <div className="flex items-center gap-4 border-b border-line py-5 sm:border-b-0 sm:border-r sm:px-5 sm:pl-0"><BookOpen className="size-5 text-accent" /><div><p className="text-2xl font-semibold text-ink">{library.stats.active}</p><p className="text-xs text-muted">obras na biblioteca</p></div></div>
        <div className="flex items-center gap-4 border-b border-line py-5 sm:border-b-0 sm:border-r sm:px-5"><Feather className="size-5 text-accent" /><div><p className="text-2xl font-semibold text-ink">{new Intl.NumberFormat('pt-BR').format(library.stats.words)}</p><p className="text-xs text-muted">palavras registradas</p></div></div>
        <div className="flex items-center gap-4 py-5 sm:px-5 sm:pr-0"><Check className="size-5 text-success" /><div><p className="text-sm font-semibold text-ink">Perfil preparado</p><p className="text-xs text-muted">Tudo pronto para começar</p></div></div>
      </section>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)] lg:gap-12">
        <section aria-labelledby="library-title">
          <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
            <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Sua biblioteca</p><h2 id="library-title" className="mt-1 font-serif text-2xl font-semibold text-ink">Obras recentes</h2></div>
            <Link href="/library/all" className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline">Ver biblioteca<ArrowRight className="size-3" /></Link>
          </div>

          <div className="mt-3 divide-y divide-line">{library.works.slice(0, 3).map((work) => <Link key={work.id} href={`/write/editor?work=${work.id}`} className="group flex items-center gap-4 py-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-control bg-accent-subtle text-accent"><BookOpen className="size-5" /></span><span className="min-w-0 flex-1"><span className="block truncate font-serif text-lg font-semibold text-ink">{work.title}</span><span className="mt-0.5 block text-xs text-muted">{new Intl.NumberFormat('pt-BR').format(work.wordCount)} palavras · {work.genre}</span></span><ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent" /></Link>)}</div>

          <section className="mt-8" aria-labelledby="journey-title">
            <div className="flex items-center gap-3"><Target className="size-5 text-accent" /><h2 id="journey-title" className="font-serif text-xl font-semibold text-ink">Sua jornada de autor</h2></div>
            <ol className="mt-5 grid gap-0 sm:grid-cols-3">
              <li className="relative border-l-2 border-success pb-6 pl-5 sm:border-l-0 sm:border-t-2 sm:pb-0 sm:pl-0 sm:pt-5"><span className="absolute -left-[7px] top-0 size-3 rounded-full bg-success ring-4 ring-canvas sm:-top-[7px] sm:left-0" /><p className="text-sm font-medium text-ink">Conta criada</p><p className="mt-1 text-xs text-muted">Seu espaço está protegido.</p></li>
              <li className="relative border-l-2 border-success pb-6 pl-5 sm:border-l-0 sm:border-t-2 sm:pb-0 sm:pl-4 sm:pt-5"><span className="absolute -left-[7px] top-0 size-3 rounded-full bg-success ring-4 ring-canvas sm:-top-[7px] sm:left-4" /><p className="text-sm font-medium text-ink">Perfil preparado</p><p className="mt-1 text-xs text-muted">Preferências registradas.</p></li>
              <li className="relative border-l-2 border-line pl-5 sm:border-l-0 sm:border-t-2 sm:pl-4 sm:pt-5"><span className="absolute -left-[7px] top-0 size-3 rounded-full bg-line-strong ring-4 ring-canvas sm:-top-[7px] sm:left-4" /><p className="text-sm font-medium text-ink">Primeira obra</p><p className="mt-1 text-xs text-muted">Seu próximo capítulo.</p></li>
            </ol>
          </section>
        </section>

        <aside className="space-y-8">
          <section aria-labelledby="shortcuts-title">
            <div className="border-b border-line pb-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Acesso rápido</p><h2 id="shortcuts-title" className="mt-1 font-serif text-2xl font-semibold text-ink">Atalhos</h2></div>
            <div>{quickActions.map((action) => <QuickAction key={action.label} {...action} />)}</div>
          </section>

          <section className="relative overflow-hidden border-l-2 border-accent px-5 py-2" aria-labelledby="note-title">
            <Sparkles className="size-5 text-accent" aria-hidden="true" />
            <h2 id="note-title" className="mt-4 font-serif text-lg font-semibold text-ink">Nota para hoje</h2>
            <blockquote className="mt-2 font-serif text-base italic leading-relaxed text-muted">“O primeiro rascunho pede coragem. O segundo encontra a forma.”</blockquote>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted"><Lightbulb className="size-3.5" />Volte para uma ideia que você ainda não terminou.</div>
          </section>
        </aside>
      </div>
    </div>
  );
}
