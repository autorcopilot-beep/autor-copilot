import type { MetadataRoute } from 'next';
import { publicPages } from '@/features/public-site/catalog';
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  if (!origin) return [];
  return ['', ...Object.keys(publicPages), 'demo', 'precos', 'cookies', 'faq', 'legal', 'blog', 'ajuda', 'updates', 'status', 'publicacoes', 'newsletters', 'comunicados'].map((path) => ({ url: `${origin.replace(/\/$/, '')}/${path}`, changeFrequency: 'weekly', priority: path ? 0.6 : 1 }));
}
