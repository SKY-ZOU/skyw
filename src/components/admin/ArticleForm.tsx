'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TrilingualTabs, { type Lang } from './TrilingualTabs';
import ImageUrlGuide from './ImageUrlGuide';

interface ArticleData {
  id?: number;
  slug: string;
  category: string;
  published: boolean;
  featured: boolean;
  date: string;
  coverImage: string;
  keywords: string;
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
  featured: false,
  date: new Date().toISOString().slice(0, 10),
  coverImage: '',
  keywords: '',
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
      {/* 基本信息 */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-body-sm font-medium text-[#1a1a2e]">
            URL Slug
            <span className="ml-1 text-[11px] font-normal text-[#adb5bd]">（英文，用于链接）</span>
          </label>
          <input
            className={inputClass}
            placeholder="e.g. skyw-fund-update-2026"
            value={form.slug}
            onChange={(e) => update('slug', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-medium text-[#1a1a2e]">文章分类</label>
          <select
            className={inputClass}
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
          >
            <option value="news">公司新闻</option>
            <option value="market">市场分析</option>
            <option value="industry">行业洞察</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-medium text-[#1a1a2e]">发布日期</label>
          <input
            type="date"
            className={inputClass}
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
            required
          />
        </div>
      </div>

      {/* 封面图 */}
      <div>
        <label className="mb-1 block text-body-sm font-medium text-[#1a1a2e]">
          封面图片
          <span className="ml-1 text-[11px] font-normal text-[#adb5bd]">（显示在文章列表和详情页顶部）</span>
        </label>
        <ImageUrlGuide
          type="article-cover"
          value={form.coverImage}
          onChange={(val) => update('coverImage', val)}
          inputClass={inputClass}
        />
      </div>

      {/* 发布状态 & 推荐 */}
      <div className="flex flex-wrap gap-5">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={form.published}
            onChange={(e) => update('published', e.target.checked)}
            className="h-4 w-4 rounded border-[#e5e7eb]"
          />
          <label htmlFor="published" className="text-body-sm font-medium text-[#1a1a2e]">
            立即发布（取消勾选则保存为草稿）
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => update('featured', e.target.checked)}
            className="h-4 w-4 rounded border-[#e5e7eb]"
          />
          <label htmlFor="featured" className="text-body-sm font-medium text-[#1a1a2e]">
            ⭐ 首页推荐置顶
            <span className="ml-1 text-[11px] font-normal text-[#adb5bd]">（会在首页行业洞察区优先展示）</span>
          </label>
        </div>
      </div>

      {/* 三语内容 */}
      <div>
        <p className="mb-3 text-body-sm font-medium text-[#1a1a2e]">多语言内容</p>
        <TrilingualTabs>
          {(lang: Lang) => {
            const cap = lang.charAt(0).toUpperCase() + lang.slice(1);
            return (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-body-sm font-medium text-[#1a1a2e]">标题</label>
                  <input
                    className={inputClass}
                    value={form[`title${cap}` as keyof ArticleData] as string}
                    onChange={(e) => update(`title${cap}` as keyof ArticleData, e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-body-sm font-medium text-[#1a1a2e]">
                    摘要
                    <span className="ml-1 text-[11px] font-normal text-[#adb5bd]">（显示在文章列表卡片，100字以内）</span>
                  </label>
                  <textarea
                    className={inputClass + ' h-24 resize-none'}
                    value={form[`excerpt${cap}` as keyof ArticleData] as string}
                    onChange={(e) => update(`excerpt${cap}` as keyof ArticleData, e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-body-sm font-medium text-[#1a1a2e]">
                    正文内容
                    <span className="ml-1 text-[11px] font-normal text-[#adb5bd]">（支持换行，建议段落之间空一行）</span>
                  </label>
                  <textarea
                    className={inputClass + ' h-64 resize-y'}
                    value={form[`content${cap}` as keyof ArticleData] as string}
                    onChange={(e) => update(`content${cap}` as keyof ArticleData, e.target.value)}
                    required
                  />
                </div>
              </div>
            );
          }}
        </TrilingualTabs>
      </div>

      {/* SEO 优化专区 */}
      <div className="rounded-lg border border-[#e5e7eb] bg-[#fafafa] p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-base">🔍</span>
          <p className="text-body-sm font-semibold text-[#1a1a2e]">搜索引擎优化 (SEO)</p>
          <span className="rounded bg-gold-400/15 px-2 py-0.5 text-[11px] font-medium text-gold-600">影响 Google 排名</span>
        </div>

        {/* 关键词 */}
        <div className="mb-4">
          <label className="mb-1 block text-body-sm font-medium text-[#1a1a2e]">
            关键词
            <span className="ml-1 text-[11px] font-normal text-[#adb5bd]">（用英文逗号分隔，建议 3–8 个）</span>
          </label>
          <input
            className={inputClass}
            placeholder="例：港股，IPO配售，天汇基金，香港投资"
            value={form.keywords}
            onChange={(e) => update('keywords', e.target.value)}
          />
          <p className="mt-1 text-[11px] text-[#adb5bd]">
            关键词会写入页面 meta keywords，帮助搜索引擎理解文章主题。建议包含公司名、业务类型、目标读者关键词。
          </p>
        </div>

        {/* Google 搜索结果预览 */}
        <div>
          <p className="mb-2 text-[12px] font-medium text-[#6c757d]">Google 搜索结果预览（简体中文版）</p>
          <div className="rounded-lg border border-[#e5e7eb] bg-white p-4">
            <p className="text-[18px] font-normal leading-snug text-[#1a0dab] hover:underline cursor-pointer">
              {form.titleZhCN || '文章标题（填写简体标题后显示）'}
            </p>
            <p className="mt-0.5 text-[13px] text-[#006621]">
              {typeof window !== 'undefined' ? window.location.origin : 'https://skyw-website.netlify.app'}/zh-CN/insights/{form.slug || 'your-slug'}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-[#545454]">
              {form.excerptZhCN
                ? form.excerptZhCN.slice(0, 155) + (form.excerptZhCN.length > 155 ? '...' : '')
                : '摘要将显示在此（填写摘要后预览）'}
            </p>
          </div>
          <p className="mt-2 text-[11px] text-[#adb5bd]">
            💡 标题建议 25–40 字，摘要建议 60–155 字。封面图将作为 LinkedIn / 微信等社交平台分享时的预览图。
          </p>
        </div>

        {/* 社交分享预览（OG Card） */}
        {form.coverImage && (
          <div className="mt-4">
            <p className="mb-2 text-[12px] font-medium text-[#6c757d]">社交媒体分享卡片预览（LinkedIn / 微信）</p>
            <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
              <img
                src={form.coverImage}
                alt="OG预览"
                className="h-40 w-full object-cover"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <div className="p-3">
                <p className="text-[12px] text-[#adb5bd] uppercase tracking-wide">skyw-website.netlify.app</p>
                <p className="text-[14px] font-semibold text-[#1a1a2e]">{form.titleZhCN || '文章标题'}</p>
                <p className="text-[12px] text-[#6c757d]">{form.excerptZhCN?.slice(0, 80) || '摘要...'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#070B14] px-6 py-2.5 text-body-sm font-medium text-white transition-colors hover:bg-[#1A2A4A] disabled:opacity-50"
        >
          {saving ? '保存中...' : isEdit ? '保存修改' : '发布文章'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/articles')}
          className="rounded-lg border border-[#e5e7eb] px-6 py-2.5 text-body-sm font-medium text-[#6c757d] transition-colors hover:bg-[#f8f9fa]"
        >
          取消
        </button>
      </div>
    </form>
  );
}
