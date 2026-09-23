import { PublicCatalogPage } from '@/features/omnipublish/public-pages';
export const metadata = { title: 'Cartas do Autor Copilot', description: 'Arquivo de newsletters e cartas editoriais.' };
export default function NewslettersPage() { return <PublicCatalogPage channel="email" />; }
