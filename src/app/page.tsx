import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpenText } from 'lucide-react';

import { Badge, Card, CardContent, buttonVariants } from '@/components/ui';
import { brandImage } from '@/lib/brand-image';
import { cn } from '@/lib/cn';

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 sm:py-6 lg:px-12 lg:py-8">
      <header className="mx-auto flex max-w-6xl items-center justify-between rounded-card border border-line bg-surface px-4 py-3 shadow-soft sm:px-5">
        <div className="flex items-center gap-3">
          {brandImage ? (
            <Image
              src={brandImage}
              alt=""
              width={32}
              height={32}
              className="size-8 object-contain"
              priority
            />
          ) : (
            <BookOpenText aria-hidden="true" className="size-7 text-accent" />
          )}
          <span className="font-semibold tracking-wide">AUTOR COPILOT</span>
        </div>
        <span className="hidden text-sm text-muted sm:inline">Seu espaço de escrita</span>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div className="max-w-2xl">
          <Badge>Escrita e planejamento em um só lugar</Badge>
          <h1 className="mt-6 max-w-xl font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
            Toda grande história merece espaço para crescer.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            Um ambiente sereno para escrever, planejar e organizar as histórias
            que você quer contar.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register" className={buttonVariants({ size: 'wide' })}>
              Criar meu espaço
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="#visao" className={cn(buttonVariants({ variant: 'secondary', size: 'wide' }))}>
              Conhecer a proposta
            </Link>
          </div>
        </div>

        <Card id="visao" aria-labelledby="preview-title" className="bg-editor">
          <CardContent className="p-7 sm:p-10 lg:p-12">
            <p className="text-meta text-muted">Manuscrito · Rascunho</p>
            <h2
              id="preview-title"
              className="mt-8 font-serif text-document-title text-ink"
            >
              O primeiro capítulo
            </h2>
            <div className="mt-5 max-w-manuscript space-y-5 font-serif text-editor text-ink">
              <p>
                Toda história começa com uma ideia. Aqui, cada cena encontra seu
                lugar, e cada personagem tem uma história para contar.
              </p>
              <p>
                As ferramentas permanecem por perto, mas é a escrita que ocupa o
                primeiro plano.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
