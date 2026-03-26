'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import DeleteConfirm from '@/components/admin/DeleteConfirm';

interface Article {
  id: number;
  slug: string;
  titleZhCN: string;
  excerptZhCN: string;
  contentZhCN: string;
  coverImage: string;
  keywords: string;
  featured: boolean;
  category: string;
  published: boolean;
  date: string;
}

function calcGeoScore(a: Article): number {
  let s = 0;
  if (a.titleZhCN.length >= 10 && a.titleZhCN.length <= 40) s += 20;
  if (a.excerptZhCN.length >= 40 && a.excerptZhCN.length <= 155) s += 25;
  if (a.coverImage) s += 20;
  if (a.keywords) s += 20;
  if (a.contentZhCN.length >= 200) s += 15;
  return s;
}

const categoryLabels: Record<string, string> = {
  news: '公司新闻',
  market: '市场分析',
  industry: '行业洞察',
};

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filter, setFilter] = useState('all');
  const [deleting, setDeleting] = useState<Article | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/articles')
      .then((r) => r.json())
      .then(setArticles);
  }, []);

  const filtered =
    filter === 'all' ? articles : articles.filter((a) => a.category === filter);

  async function handleDelete() {
    if (!deleting) return;
    await fetch(`/api/admin/articles/${deleting.id}`, { method: 'DELETE' });
    setArticles((prev) => prev.filter((a) => a.id !== deleting.id));
    setDeleting(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#1a1a2e]">文章管理</h1>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 rounded-lg bg-[#070B14] px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#1A2A4A]"
        >
          <Plus className="h-4 w-4" />
          发布新文章
        </Link>
      </div>

      {/* 分类筛选 */}
      <div className="mt-6 flex gap-2">
        {(['all', 'news', 'market', 'industry'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
              filter === cat
                ? 'bg-[#070B14] text-white'
                : 'bg-white text-[#6c757d] hover:bg-[#f0f0f0]'
            }`}
          >
            {cat === 'all' ? '全部' : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* 文章列表 */}
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#e5e7eb]">
              <th className="px-6 py-3 text-[12px] font-semibold uppercase tracking-wider text-[#6c757d]">
                标题
              </th>
              <th className="px-6 py-3 text-[12px] font-semibold uppercase tracking-wider text-[#6c757d]">
                分类
              </th>
              <th className="px-6 py-3 text-[12px] font-semibold uppercase tracking-wider text-[#6c757d]">
                日期
              </th>
              <th className="px-6 py-3 text-[12px] font-semibold uppercase tracking-wider text-[#6c757d]">
                GEO
              </th>
              <th className="px-6 py-3 text-[12px] font-semibold uppercase tracking-wider text-[#6c757d]">
                状态
              </th>
              <th className="px-6 py-3 text-right text-[12px] font-semibold uppercase tracking-wider text-[#6c757d]">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((article) => (
              <tr
                key={article.id}
                className="border-b border-[#e5e7eb] last:border-0"
              >
                <td className="px-6 py-4 text-[14px] font-medium text-[#1a1a2e]">
                  {article.titleZhCN}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#6c757d]">
                  {categoryLabels[article.category] ?? article.category}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#6c757d]">
                  {article.date}
                </td>
                <td className="px-6 py-4">
                  {(() => {
                    const score = calcGeoScore(article);
                    const color = score >= 80 ? 'bg-green-50 text-green-700' : score >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500';
                    return (
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${color}`} title="GEO 优化得分（满分100）">
                        {score}分
                      </span>
                    );
                  })()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        article.published
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {article.published ? '已发布' : '草稿'}
                    </span>
                    {article.featured && (
                      <span className="inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600">
                        ⭐ 推荐
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => router.push(`/admin/articles/${article.id}/edit`)}
                      className="rounded-lg p-2 text-[#6c757d] transition-colors hover:bg-[#f8f9fa] hover:text-[#1a1a2e]"
                      title="编辑"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleting(article)}
                      className="rounded-lg p-2 text-[#6c757d] transition-colors hover:bg-red-50 hover:text-red-600"
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-6 py-12 text-center text-[14px] text-[#adb5bd]">
            暂无文章
          </p>
        )}
      </div>

      <DeleteConfirm
        open={!!deleting}
        title={deleting?.titleZhCN ?? ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
