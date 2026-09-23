import { PublicPublicationPage } from '@/features/omnipublish/public-pages';
export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <PublicPublicationPage channel="blog" slug={slug} />; }
