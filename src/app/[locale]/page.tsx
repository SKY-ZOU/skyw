import { getPublishedArticles, getMetrics } from '@/lib/data';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [articles, metrics] = await Promise.all([
    getPublishedArticles(),
    getMetrics(),
  ]);

  return <HomeClient articles={articles} metrics={metrics} />;
}
