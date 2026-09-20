import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { BookDashed, Check, Feather, Library, Plus } from 'lucide-react';

import { Badge, Button, Card, CardContent } from '@/components/ui';
import { AccountPanel } from '@/features/auth/components/account-panel';
import { AuthBrand } from '@/features/auth/components/auth-brand';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Mesa de escrita' };

const focusLabels: Record<string, string> = {
  fiction: 'Romance ou ficção',
  nonfiction: 'Não ficção',
  poetry: 'Poesia',
  screenplay: 'Roteiro',
  other: 'Outro formato',
};

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) redirect('/login?next=/dashboard');

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, pen_name, writing_focus, onboarding_completed_at')
    .eq('id', userId)
    .single();

  if (!profile?.onboarding_completed_at) redirect('/onboarding');

  const email = typeof claimsData.claims.email === 'string' ? claimsData.claims.email : undefined;
  const focus = profile.writing_focus ? focusLabels[profile.writing_focus] : undefined;
  const account = { displayName: profile.display_name, email, penName: profile.pen_name ?? undefined, writingFocus: focus };

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <header className="mx-auto flex max-w-6xl items-center justify-between rounded-card border border-line bg-surface px-3 py-2.5 shadow-soft sm:px-5">
        <AuthBrand />
        <div className="lg:hidden"><AccountPanel {...account} mobile /></div>
        <div className="hidden items-center gap-2 text-sm text-muted lg:flex"><Library className="size-4 text-accent" aria-hidden="true" />Biblioteca particular</div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:py-10">
        <div className="space-y-6">
          {status === 'ready' && <div className="auth-enter flex items-center gap-3 rounded-card border border-success bg-success-subtle px-4 py-3 text-sm text-ink" role="status"><Check className="size-4 text-success" aria-hidden="true" />Seu perfil de escrita está pronto.</div>}

          <section className="auth-enter" aria-labelledby="desk-title">
            <Badge>Mesa de escrita</Badge>
            <h1 id="desk-title" className="mt-5 font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">Bom retorno, {profile.pen_name || profile.display_name}.</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">Seu espaço está preparado. A primeira obra será criada na próxima etapa do produto.</p>
          </section>

          <Card className="auth-enter-delayed overflow-hidden bg-editor" aria-labelledby="empty-library-title">
            <CardContent className="grid gap-8 p-7 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <BookDashed className="size-8 text-accent" aria-hidden="true" />
                <h2 id="empty-library-title" className="mt-5 font-serif text-2xl font-semibold text-ink">A primeira lombada da estante</h2>
                <p className="mt-3 max-w-xl leading-relaxed text-muted">Aqui aparecerão suas obras, com o capítulo atual, progresso e o último ponto de escrita.</p>
              </div>
              <Button disabled aria-describedby="project-coming-soon"><Plus className="size-4" aria-hidden="true" />Criar primeira obra</Button>
              <p id="project-coming-soon" className="sr-only">A criação de obras será habilitada na próxima fase.</p>
            </CardContent>
          </Card>

          <section className="grid gap-3 sm:grid-cols-3" aria-label="Progresso da preparação">
            {([
              ['Conta', 'Confirmada', true],
              ['Perfil', 'Preparado', true],
              ['Primeira obra', 'Próxima etapa', false],
            ] as const).map(([title, copy, complete]) => (
              <div key={String(title)} className="rounded-card border border-line bg-surface p-4">
                <span className={`flex size-7 items-center justify-center rounded-full ${complete ? 'bg-success-subtle text-success' : 'bg-surface-muted text-muted'}`}><Check className="size-3.5" aria-hidden="true" /></span>
                <p className="mt-4 font-medium text-ink">{title}</p><p className="mt-1 text-sm text-muted">{copy}</p>
              </div>
            ))}
          </section>
        </div>

        <aside className="auth-enter-delayed hidden rounded-card border border-line bg-surface p-6 shadow-soft lg:block" aria-label="Conta do autor"><div className="mb-8 flex items-center gap-2 text-sm font-medium text-ink"><Feather className="size-4 text-accent" aria-hidden="true" />Perfil do autor</div><AccountPanel {...account} /></aside>
      </div>
    </main>
  );
}
