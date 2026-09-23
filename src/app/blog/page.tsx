import { PublicCatalogPage } from '@/features/omnipublish/public-pages';
export const metadata = { title: 'Revista Autor Copilot', description: 'Ideias, ensaios e histórias para quem escreve.' };
export default function BlogPage() { return <PublicCatalogPage channel="blog" />; }
