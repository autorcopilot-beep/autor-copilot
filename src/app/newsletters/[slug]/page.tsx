import { PublicPublicationPage } from '@/features/omnipublish/public-pages';
export default async function NewsletterPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <PublicPublicationPage channel="email" slug={slug} />; }
