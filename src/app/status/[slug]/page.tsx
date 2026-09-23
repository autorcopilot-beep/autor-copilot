import { PublicPublicationPage } from '@/features/omnipublish/public-pages';
export default async function IncidentPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <PublicPublicationPage channel="status" slug={slug} />; }
