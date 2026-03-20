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
  category: string;
  published: boolean;
  date: string;
}

const categoryLabels: Record<string, string> = {
  news: 'Company News',
  market: 'Market Analysis',
  industry: 'Industry Insights',
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
        <h1 className="text-2xl font-semibold text-[#1a1a2e]">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 rounded-lg bg-[#070B14] px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#1A2A4A]"
        >
          <Plus className="h-4 w-4" />
          New Article
        </Link>
      </div>

      {/* Filter */}
      <div className="mt-6 flex gap-2">
        {['all', 'news', 'market', 'industry'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
              filter === cat
                ? 'bg-[#070B14] text-white'
                : 'bg-white text-[#6c757d] hover:bg-[#f0f0f0]'
            }`}
          >
            {cat === 'all' ? 'All' : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#e5e7eb]">
              <th className="px-6 py-3 text-[12px] font-semibold uppercase tracking-wider text-[#6c757d]">
                Title
              </th>
              <th className="px-6 py-3 text-[12px] font-semibold uppercase tracking-wider text-[#6c757d]">
                Category
              </th>
              <th className="px-6 py-3 text-[12px] font-semibold uppercase tracking-wider text-[#6c757d]">
                Date
              </th>
              <th className="px-6 py-3 text-[12px] font-semibold uppercase tracking-wider text-[#6c757d]">
                Status
              </th>
              <th className="px-6 py-3 text-right text-[12px] font-semibold uppercase tracking-wider text-[#6c757d]">
                Actions
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
                  {categoryLabels[article.category]}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#6c757d]">
                  {article.date}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      article.published
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {article.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => router.push(`/admin/articles/${article.id}/edit`)}
                      className="rounded-lg p-2 text-[#6c757d] transition-colors hover:bg-[#f8f9fa] hover:text-[#1a1a2e]"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleting(article)}
                      className="rounded-lg p-2 text-[#6c757d] transition-colors hover:bg-red-50 hover:text-red-600"
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
            No articles found.
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
