import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { publicPages } from '@/features/public-site/catalog';
import { ProductDemo } from '@/features/public-site/demo';
import { Pricing } from '@/features/public-site/pricing';
import { CookiesPage } from '@/features/public-site/cookies-page';
import { FAQ } from '@/features/public-site/landing';
const special = { precos: 'Planos e preços', demo: 'Explore o Autor Copilot', cookies: 'Cookies e preferências', faq: 'Perguntas frequentes' };
type Props = { params: Promise<{ publicPage: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return [...Object.keys(publicPages), ...Object.keys(special)].map((publicPage) => ({ publicPage })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { publicPage } = await params;
  const page = publicPages[publicPage as keyof typeof publicPages];
  return { title: page?.title ?? special[publicPage as keyof typeof special], description: page?.description ?? 'Conheça o Autor Copilot e seu ambiente de escrita.' };
}
export default async function PublicPage({ params }: Props) {
  const { publicPage } = await params;
  if (publicPage === 'precos') return <main><Pricing /></main>;
  if (publicPage === 'cookies') return <main><CookiesPage /></main>;
  if (publicPage === 'faq') return <main><div className="ac-page-intro"><h1>Perguntas frequentes</h1></div><FAQ /></main>;
  if (publicPage === 'demo') return <main className="ac-demo-page"><div className="ac-page-intro"><span className="ac-eyebrow">Explore antes de começar</span><h1>Uma história de exemplo.<br />Possibilidades para a sua.</h1><p>Troque o nome da personagem, descubra as conexões e experimente os controles. Os dados desta demonstração são ilustrativos.</p></div><ProductDemo /></main>;
  const page = publicPages[publicPage as keyof typeof publicPages];
  if (!page) notFound();
  return <main><section className="ac-section ac-content-page"><span className="ac-eyebrow">{page.eyebrow}</span><h1>{page.title}</h1><p className="ac-page-description">{page.description}</p><div className="ac-content-grid">{page.cards.map((card, index) => { const [title, text] = card; const href = card.length > 2 ? card[2] : undefined; return <article key={title}><span className="ac-card-number">{String(index + 1).padStart(2, '0')}</span><h2>{title}</h2><p>{text}</p>{href && <Link href={href}>Explorar <ArrowUpRight size={14} /></Link>}</article>; })}</div></section></main>;
}
