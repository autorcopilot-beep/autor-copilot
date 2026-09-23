import { PublicCatalogPage } from '@/features/omnipublish/public-pages';
export const metadata = { title: 'Central de ajuda', description: 'Guias e respostas para usar o Autor Copilot.' };
export default function KnowledgePage() { return <PublicCatalogPage channel="knowledge" />; }
