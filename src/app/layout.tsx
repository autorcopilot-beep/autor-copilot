import type { Metadata } from 'next';
import { Inter, Literata } from 'next/font/google';
import './globals.css';
import { faviconImage } from '@/lib/favicon-image';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const literata = Literata({ subsets: ['latin'], variable: '--font-literata', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Autor Copilot', template: '%s | Autor Copilot' },
  description: 'Seu espaço para escrever e organizar histórias.',
  ...(faviconImage ? { icons: { icon: faviconImage } } : {}),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${inter.variable} ${literata.variable} font-sans antialiased`}>{children}</body></html>;
}
