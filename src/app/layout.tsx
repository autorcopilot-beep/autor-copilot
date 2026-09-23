import type { Metadata } from 'next';
import { Inter, Literata } from 'next/font/google';
import Script from 'next/script';
import { Suspense } from 'react';

import './globals.css';
import './public-site.css';
import './public-editorial.css';
import { PublicShell } from '@/features/public-site/public-shell';
import { AccessibilityMenu } from '@/features/accessibility/accessibility-menu';
import { accessibilityBootstrapScript } from '@/features/accessibility/bootstrap';
import { faviconImage } from '@/lib/favicon-image';
import { NavigationProgress } from '@/components/navigation-progress';
import { SoundProvider } from '@/features/sound/sound-provider';
import { ProductGuidance } from '@/features/guidance/product-guidance';
import { PreferenceHydrator } from '@/features/account/components/preference-hydrator';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const literata = Literata({ subsets: ['latin'], variable: '--font-literata', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
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
        <Suspense fallback={null}><NavigationProgress /></Suspense>
        <SoundProvider><PreferenceHydrator /><PublicShell>{children}</PublicShell><ProductGuidance /></SoundProvider>
        <AccessibilityMenu />
      </body>
    </html>
  );
}
