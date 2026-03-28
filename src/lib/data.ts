import { prisma } from './db';

export async function getSettings() {
  return prisma.setting.findFirst();
}

export async function getMetrics() {
  return prisma.metric.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function getOffices() {
  return prisma.office.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function getDivisions() {
  return prisma.businessDivision.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function getDivisionBySlug(slug: string) {
  return prisma.businessDivision.findUnique({ where: { slug } });
}

export async function getPublishedArticles() {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { date: 'desc' },
  });
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({ where: { slug } });
}

export async function getAdjacentArticles(currentId: number) {
  const [prev, next] = await Promise.all([
    prisma.article.findFirst({
      where: { id: { lt: currentId }, published: true },
      orderBy: { id: 'desc' },
      select: { slug: true, titleZhCN: true, titleZhTW: true, titleEn: true }
    }),
    prisma.article.findFirst({
      where: { id: { gt: currentId }, published: true },
      orderBy: { id: 'asc' },
      select: { slug: true, titleZhCN: true, titleZhTW: true, titleEn: true }
    })
  ]);
  return { prev, next };
}

export async function getAllArticleSlugs() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return articles.map((a) => a.slug);
}
