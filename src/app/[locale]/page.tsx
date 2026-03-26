import { getPublishedArticles, getMetrics } from '@/lib/data';
import { prisma } from '@/lib/db';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [articles, metrics, setting] = await Promise.all([
    getPublishedArticles(),
    getMetrics(),
    prisma.setting.findFirst(),
  ]);

  const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://skyw-website.netlify.app';

  // Organization JSON-LD
  const orgSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: setting?.companyFull ?? 'SkyW Capital',
    alternateName: setting?.companyName ?? 'SKYW',
    url: BASE,
    logo: `${BASE}/logo.png`,
    description: setting?.geoOrgDesc || undefined,
    foundingDate: setting?.geoOrgFounded || undefined,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: setting?.phone ?? '',
      email: setting?.email ?? '',
      contactType: 'customer service',
    },
    ...(setting?.linkedinUrl ? { sameAs: [setting.linkedinUrl].filter(Boolean) } : {}),
  };

  // FAQPage JSON-LD
  let faqSchema: Record<string, unknown> | null = null;
  try {
    const faqs = JSON.parse(setting?.faqJson ?? '[]') as { q: string; a: string }[];
    if (faqs.length > 0) {
      faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs
          .filter((f) => f.q && f.a)
          .map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
      };
    }
  } catch { /* ignore */ }

  // WebSite JSON-LD (enables Google Sitelinks Search)
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: setting?.companyFull ?? 'SkyW Capital',
    url: BASE,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <HomeClient articles={articles} metrics={metrics} />
    </>
  );
}
