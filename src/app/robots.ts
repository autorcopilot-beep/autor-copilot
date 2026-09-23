import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  return { rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/account/', '/write/', '/dashboard', '/library/', '/overview/', '/auth/', '/onboarding/'] }, ...(url ? { sitemap: `${url.replace(/\/$/, '')}/sitemap.xml` } : {}) };
}
