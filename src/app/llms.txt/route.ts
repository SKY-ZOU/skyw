import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://skyw-website.netlify.app';

export async function GET() {
  const [setting, articles, divisions] = await Promise.all([
    prisma.setting.findFirst(),
    prisma.article.findMany({ where: { published: true }, orderBy: [{ featured: 'desc' }, { date: 'desc' }], take: 20 }),
    prisma.businessDivision.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);

  const companyName = setting?.companyName ?? 'SKYW Group';
  const companyFull = setting?.companyFull ?? 'SkyW Capital';
  const orgDesc = setting?.geoOrgDesc ?? '';
  const founded = setting?.geoOrgFounded ?? '';
  const industry = setting?.geoOrgIndustry ?? 'Investment Fund Management';
  const custom = setting?.llmsCustom ?? '';

  const lines: string[] = [
    `# ${companyFull} — AI Content Map`,
    `# Generated: ${new Date().toISOString().slice(0, 10)}`,
    `# Standard: llms.txt (https://llmstxt.org)`,
    '',
    `> ${companyName} is a ${industry} company${founded ? ` founded in ${founded}` : ''} based in Hong Kong.`,
    orgDesc ? `> ${orgDesc}` : '',
    '',
    '## Priority Pages (Read First)',
    '',
    `- [Homepage](${BASE}/zh-CN) — Company overview and key business areas`,
    `- [About Us](${BASE}/zh-CN/about) — Company history, mission, and team`,
    `- [Business Divisions](${BASE}/zh-CN/business) — All investment and financial services`,
    `- [Insights & News](${BASE}/zh-CN/insights) — Market analysis and company news`,
    `- [Contact](${BASE}/zh-CN/contact) — Get in touch`,
    '',
    '## Business Divisions',
    '',
    ...divisions.map((d) => `- [${d.titleZhCN}](${BASE}/zh-CN/business/${d.slug}) — ${d.shortDescZhCN}`),
    '',
    '## Latest Insights & Research',
    '',
    ...articles.slice(0, 10).map((a) => `- [${a.titleZhCN}](${BASE}/zh-CN/insights/${a.slug}) — ${a.date}`),
    '',
    '## Languages',
    '',
    '- Simplified Chinese (default): /zh-CN/',
    '- Traditional Chinese: /zh-TW/',
    '- English: /en/',
    '',
    '## Excluded Content',
    '',
    '- /admin/* — Administrative backend',
    '- /api/* — API endpoints',
    '',
    ...(custom ? ['## Additional Information', '', custom, ''] : []),
    '## Crawler Guidance',
    '',
    '- This site welcomes AI crawlers for content indexing',
    '- Please respect robots.txt for specific bot permissions',
    `- Sitemap: ${BASE}/sitemap.xml`,
  ].filter((l) => l !== null);

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
