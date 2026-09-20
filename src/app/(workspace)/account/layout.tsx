import type { Metadata } from 'next';
import Image from 'next/image';

import { AccountNavigation } from '@/features/account/components/account-navigation';

export const metadata: Metadata = { title: 'Configurações da conta' };

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl py-4 sm:py-7">
      <section className="relative mb-6 min-h-44 overflow-hidden border-b border-line sm:mb-8 sm:min-h-52" aria-labelledby="account-page-title">
        <div className="relative z-10 max-w-3xl pb-6 pr-24 pt-4 sm:pb-8 sm:pr-64 sm:pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Sua conta</p>
          <h1 id="account-page-title" className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">Configurações da conta</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">Organize sua identidade de autor, preferências e acessos em um só lugar.</p>
        </div>
        <div
          className="pointer-events-none absolute -bottom-14 -right-16 size-52 opacity-70 sm:-bottom-24 sm:-right-10 sm:size-80 sm:opacity-85 lg:-bottom-28 lg:right-2 lg:size-96"
          style={{
            WebkitMaskImage: 'radial-gradient(circle at 54% 54%, #000 38%, rgb(0 0 0 / 0.9) 57%, transparent 79%)',
            maskImage: 'radial-gradient(circle at 54% 54%, #000 38%, rgb(0 0 0 / 0.9) 57%, transparent 79%)',
          }}
        >
          <Image src="/images/Aquarela_Literaria_Abas/02_png/configuracoes.png" alt="" fill sizes="(max-width: 640px) 208px, (max-width: 960px) 320px, 384px" className="scale-105 object-contain mix-blend-multiply saturate-[0.9] contrast-[0.98] dark:mix-blend-screen dark:opacity-35" priority quality={88} />
        </div>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-7">
        <AccountNavigation />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
