import { PublicCatalogPage } from '@/features/omnipublish/public-pages';
export const metadata = { title: 'Status dos serviços', description: 'Incidentes, manutenções e histórico do Autor Copilot.' };
export default function StatusPage() { return <PublicCatalogPage channel="status" />; }
