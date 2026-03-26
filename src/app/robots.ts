import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// 所有已知 AI 爬虫
const ALL_BOTS: Record<string, string> = {
  GPTBot: 'ChatGPT / OpenAI',
  ClaudeBot: 'Claude / Anthropic',
  PerplexityBot: 'Perplexity AI',
  'Google-Extended': 'Google Gemini / AI Overview',
  YouBot: 'You.com',
  'CCBot': 'Common Crawl (AI 训练)',
  'cohere-ai': 'Cohere AI',
};

export default async function robots(): Promise<MetadataRoute.Robots> {
  const setting = await prisma.setting.findFirst();
  const allowed = (setting?.geoAllowBots ?? 'GPTBot,ClaudeBot,PerplexityBot,Google-Extended').split(',').map((s) => s.trim()).filter(Boolean);

  const rules: MetadataRoute.Robots['rules'] = [
    // 所有爬虫默认允许
    { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
  ];

  // 按配置决定每个 AI bot 的权限
  for (const bot of Object.keys(ALL_BOTS)) {
    if (allowed.includes(bot)) {
      rules.push({ userAgent: bot, allow: '/' });
    } else {
      rules.push({ userAgent: bot, disallow: '/' });
    }
  }

  return {
    rules,
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://skyw-website.netlify.app'}/sitemap.xml`,
  };
}
