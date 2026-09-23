import { PublicCatalogPage } from '@/features/omnipublish/public-pages';
export const metadata = { title: 'Comunicados', description: 'Mensagens oficiais do Autor Copilot.' };
export default function AnnouncementsPage() { return <PublicCatalogPage channel="in_app" />; }
