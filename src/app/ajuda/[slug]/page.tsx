import { PublicPublicationPage } from '@/features/omnipublish/public-pages';
export default async function KnowledgeArticlePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <PublicPublicationPage channel="knowledge" slug={slug} />; }
