import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://skyw-website.netlify.app';
const LOCALES = ['zh-CN', 'zh-TW', 'en'];

function urls(path: string, priority: number, changeFreq: MetadataRoute.Sitemap[0]['changeFrequency']): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: `${BASE}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, divisions] = await Promise.all([
    prisma.article.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.businessDivision.findMany({ select: { slug: true } }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    ...urls('', 1.0, 'weekly'),
    ...urls('/about', 0.8, 'monthly'),
    ...urls('/business', 0.9, 'weekly'),
    ...urls('/insights', 0.9, 'daily'),
    ...urls('/contact', 0.7, 'monthly'),
  ];

  const articlePages: MetadataRoute.Sitemap = articles.flatMap((a) =>
    LOCALES.map((locale) => ({
      url: `${BASE}/${locale}/insights/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  const businessPages: MetadataRoute.Sitemap = divisions.flatMap((d) =>
    LOCALES.map((locale) => ({
      url: `${BASE}/${locale}/business/${d.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  );

  return [...staticPages, ...articlePages, ...businessPages];
}
