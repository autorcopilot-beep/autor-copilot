import { PublicCatalogPage } from '@/features/omnipublish/public-pages';

export const metadata = { title: 'Changelog', description: 'Novidades, melhorias e correções do Autor Copilot.' };
export default function UpdatesPage() { return <PublicCatalogPage channel="changelog" />; }
