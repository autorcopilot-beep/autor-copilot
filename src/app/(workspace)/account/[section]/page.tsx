import { LockKeyhole } from 'lucide-react';
import { notFound } from 'next/navigation';

import { getAccountSection } from '@/features/account/navigation';

export default async function AccountComingSoonPage({ params }: { params: Promise<{ section: string }> }) {
  const { section: slug } = await params;
  const section = getAccountSection(slug);
  if (!section || section.status === 'available') notFound();
  const Icon = section.icon;

  return (
    <section className="flex min-h-[26rem] flex-col items-center justify-center border-b border-line px-4 py-8 text-center" aria-labelledby="coming-soon-title">
      <span className="flex size-14 items-center justify-center rounded-full bg-warning-subtle text-warning"><Icon className="size-6" /></span>
      <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-warning/25 bg-warning-subtle px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-warning"><LockKeyhole className="size-3" />Em breve</div>
      <h2 id="coming-soon-title" className="mt-4 font-serif text-2xl font-semibold text-ink">{section.label}</h2>
      <p className="mt-2 max-w-md leading-relaxed text-muted">{section.description} A estrutura desta área já está preparada e será liberada conforme o recurso for desenvolvido.</p>
    </section>
  );
}
