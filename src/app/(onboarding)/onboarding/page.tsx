import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { BookOpen, Check } from 'lucide-react';

import { Badge, Card, CardContent } from '@/components/ui';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Seu espaço de escrita' };

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) redirect('/register');

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', userId)
    .single();

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="auth-enter w-full max-w-2xl bg-editor" aria-labelledby="welcome-title">
        <CardContent className="p-7 sm:p-12">
          <div className="flex items-center justify-between gap-4">
            <Badge>Conta confirmada</Badge>
            <span className="flex size-9 items-center justify-center rounded-full bg-success-subtle text-success">
              <Check className="size-4" aria-hidden="true" />
            </span>
          </div>
          <BookOpen className="mt-10 size-8 text-accent" aria-hidden="true" />
          <h1 id="welcome-title" className="mt-5 max-w-xl font-serif text-4xl font-semibold leading-tight text-ink">
            {profile?.display_name ? `${profile.display_name}, seu espaço está aberto.` : 'Seu espaço está aberto.'}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Na próxima etapa, você vai escolher o tipo de obra e preparar o primeiro projeto. Por enquanto, sua conta e seu perfil de autor já estão protegidos.
          </p>
          <div className="mt-9 border-t border-line pt-6 text-sm text-muted">
            Próximo capítulo do desenvolvimento: acesso à conta e retomada segura da sessão.
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
