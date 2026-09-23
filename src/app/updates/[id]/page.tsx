import { PublicPublicationPage } from '@/features/omnipublish/public-pages';

export default async function UpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PublicPublicationPage channel="changelog" slug={id} />;
}
