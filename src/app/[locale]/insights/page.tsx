import { getPublishedArticles } from '@/lib/data';
import InsightsClient from './InsightsClient';

export const dynamic = 'force-dynamic';

export default async function InsightsPage() {
  const articles = await getPublishedArticles();
  return <InsightsClient articles={articles} />;
}
