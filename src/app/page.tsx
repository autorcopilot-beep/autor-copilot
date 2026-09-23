import type { Metadata } from 'next';
import { Landing } from '@/features/public-site/landing';
export const metadata: Metadata = {
  title: 'Autor Copilot — Escreva sua história. Conecte seu universo.',
  description: 'Um ambiente de escrita para histórias longas. Reúna manuscrito, personagens, fichas e referências em um universo conectado, no seu ritmo.',
  openGraph: { title: 'Autor Copilot — Seu universo conectado', description: 'Escreva, organize e conecte suas histórias.', type: 'website', locale: 'pt_BR' },
};
export default function Home() { return <Landing />; }
