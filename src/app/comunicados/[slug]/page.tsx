import { PublicPublicationPage } from '@/features/omnipublish/public-pages';
export default async function AnnouncementPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <PublicPublicationPage channel="in_app" slug={slug} />; }
