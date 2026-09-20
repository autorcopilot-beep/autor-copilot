import type { Metadata } from 'next';
import { Inter, Literata } from 'next/font/google';
import Script from 'next/script';

import './globals.css';
import { AccessibilityMenu } from '@/features/accessibility/accessibility-menu';
import { accessibilityBootstrapScript } from '@/features/accessibility/bootstrap';
import { faviconImage } from '@/lib/favicon-image';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const literata = Literata({ subsets: ['latin'], variable: '--font-literata', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Autor Copilot', template: '%s | Autor Copilot' },
  description: 'Seu espaço para escrever e organizar histórias.',
  ...(faviconImage ? { icons: { icon: faviconImage } } : {}),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${literata.variable} font-sans antialiased`}>
        <Script
          id="accessibility-preferences"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: accessibilityBootstrapScript }}
        />
        {children}
        <AccessibilityMenu />
      </body>
    </html>
  );
}
