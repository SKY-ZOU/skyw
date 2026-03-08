'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TrilingualTabs, { type Lang } from './TrilingualTabs';

interface ArticleData {
  id?: number;
  slug: string;
  category: string;
  published: boolean;
  date: string;
  titleZhCN: string;
  titleZhTW: string;
  titleEn: string;
  excerptZhCN: string;
  excerptZhTW: string;
  excerptEn: string;
  contentZhCN: string;
  contentZhTW: string;
  contentEn: string;
}

const emptyArticle: ArticleData = {
  slug: '',
  category: 'news',
  published: true,
  date: new Date().toISOString().slice(0, 10),
  titleZhCN: '', titleZhTW: '', titleEn: '',
  excerptZhCN: '', excerptZhTW: '', excerptEn: '',
  contentZhCN: '', contentZhTW: '', contentEn: '',
};

export default function ArticleForm({ initial }: { initial?: ArticleData }) {
  const [form, setForm] = useState<ArticleData>(initial ?? emptyArticle);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const isEdit = !!initial?.id;

  function update(field: keyof ArticleData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const url = isEdit ? `/api/admin/articles/${initial!.id}` : '/api/admin/articles';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/admin/articles');
      router.refresh();
    }
    setSaving(false);
  }

  const inputClass =
    'w-full rounded-lg border border-[#e5e7eb] px-4 py-2.5 text-body-md outline-none focus:border-[#070B14] focus:ring-1 focus:ring-[#070B14]';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Meta row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-body-sm font-medium text-[#1a1a2e]">Slug</label>
          <input
            className={inputClass}
            value={form.slug}
            onChange={(e) => update('slug', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-medium text-[#1a1a2e]">Category</label>
          <select
            className={inputClass}
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
          >
            <option value="news">Company News</option>
            <option value="market">Market Analysis</option>
            <option value="industry">Industry Insights</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-medium text-[#1a1a2e]">Date</label>
          <input
            type="date"
            className={inputClass}
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          checked={form.published}
          onChange={(e) => update('published', e.target.checked)}
          className="h-4 w-4 rounded border-[#e5e7eb]"
        />
        <label htmlFor="published" className="text-body-sm font-medium text-[#1a1a2e]">
          Published
        </label>
      </div>

      {/* Trilingual fields */}
      <TrilingualTabs>
        {(lang: Lang) => (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-body-sm font-medium text-[#1a1a2e]">Title</label>
              <input
                className={inputClass}
                value={form[`title${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof ArticleData] as string}
                onChange={(e) => update(`title${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof ArticleData, e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-body-sm font-medium text-[#1a1a2e]">Excerpt</label>
              <textarea
                className={inputClass + ' h-24 resize-none'}
                value={form[`excerpt${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof ArticleData] as string}
                onChange={(e) => update(`excerpt${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof ArticleData, e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-body-sm font-medium text-[#1a1a2e]">Content</label>
              <textarea
                className={inputClass + ' h-64 resize-y'}
                value={form[`content${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof ArticleData] as string}
                onChange={(e) => update(`content${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof ArticleData, e.target.value)}
                required
              />
            </div>
          </div>
        )}
      </TrilingualTabs>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#070B14] px-6 py-2.5 text-body-sm font-medium text-white transition-colors hover:bg-[#1A2A4A] disabled:opacity-50"
        >
          {saving ? 'Saving...' : isEdit ? 'Update Article' : 'Create Article'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/articles')}
          className="rounded-lg border border-[#e5e7eb] px-6 py-2.5 text-body-sm font-medium text-[#6c757d] transition-colors hover:bg-[#f8f9fa]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
