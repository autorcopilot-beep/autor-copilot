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
