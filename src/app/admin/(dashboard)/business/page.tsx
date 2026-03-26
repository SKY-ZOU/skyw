'use client';

import { useEffect, useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import TrilingualTabs, { type Lang } from '@/components/admin/TrilingualTabs';
import ImageUrlGuide from '@/components/admin/ImageUrlGuide';

interface Division {
  id: number;
  divisionId: string;
  slug: string;
  icon: string;
  sortOrder: number;
  titleZhCN: string; titleZhTW: string; titleEn: string;
  shortDescZhCN: string; shortDescZhTW: string; shortDescEn: string;
  bodyZhCN: string; bodyZhTW: string; bodyEn: string;
  coverImage: string;
}

const ICONS = ['TrendingUp', 'Landmark', 'Coins', 'ShieldCheck', 'Zap', 'Globe', 'BarChart3', 'Building2'];

function langKey(field: string, lang: Lang) {
  return `${field}${lang.charAt(0).toUpperCase() + lang.slice(1)}`;
}

export default function BusinessPage() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Division | null>(null);

  useEffect(() => {
    fetch('/api/admin/divisions').then((r) => r.json()).then(setDivisions);
  }, []);

  function startEdit(div: Division) {
    setEditingId(div.id);
    setForm({ ...div });
  }

  function updateField(field: string, value: string) {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev);
  }

  async function save() {
    if (!form) return;
    const res = await fetch(`/api/admin/divisions/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const saved = await res.json();
    setDivisions((prev) => prev.map((d) => (d.id === saved.id ? saved : d)));
    setEditingId(null);
    setForm(null);
  }

  const inputClass =
    'w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-[14px] outline-none focus:border-[#070B14] focus:ring-1 focus:ring-[#070B14]';

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e]">业务板块管理</h1>
      <p className="mt-1 text-[14px] text-[#6c757d]">编辑各业务板块的介绍文案、详情页内容及背景图片。</p>
      <div className="mt-3 rounded-lg bg-[#f0f4ff] px-4 py-3 text-[12px] text-[#344054]">
        <strong>🔍 SEO 说明：</strong>「板块名称」将作为该业务页面的 &lt;title&gt; 标签，「简短描述」将作为 meta description。请确保两者包含核心关键词（如：港股、IPO配售、黄金投资等），字数建议：标题 10–20 字，描述 40–80 字。
      </div>

      <div className="mt-6 space-y-4">
        {divisions.map((div) => (
          <div key={div.id} className="rounded-xl bg-white p-6 shadow-sm">
            {editingId === div.id && form ? (
              <div className="space-y-4">
                {/* 基本信息 */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">
                      板块 ID
                      <span className="ml-1 text-[10px] text-[#adb5bd]">（不可修改）</span>
                    </label>
                    <input className={inputClass} value={form.divisionId} disabled />
                  </div>
                  <div>
                    <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">URL Slug</label>
                    <input className={inputClass} value={form.slug} onChange={(e) => updateField('slug', e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">图标</label>
                    <select className={inputClass} value={form.icon} onChange={(e) => updateField('icon', e.target.value)}>
                      {ICONS.map((ic) => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 三语内容 */}
                <TrilingualTabs>
                  {(lang: Lang) => (
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">板块名称</label>
                        <input
                          className={inputClass}
                          value={(form as any)[langKey('title', lang)] as string}
                          onChange={(e) => updateField(langKey('title', lang), e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">
                          简短描述
                          <span className="ml-1 text-[10px] text-[#adb5bd]">（显示在首页业务卡片）</span>
                        </label>
                        <textarea
                          className={inputClass + ' h-24 resize-none'}
                          value={(form as any)[langKey('shortDesc', lang)] as string}
                          onChange={(e) => updateField(langKey('shortDesc', lang), e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">
                          详情页正文
                          <span className="ml-1 text-[10px] text-[#adb5bd]">（JSON 格式，含 subtitle/intro/sections）</span>
                        </label>
                        <textarea
                          className={inputClass + ' h-48 resize-y font-mono text-[13px]'}
                          placeholder='{"subtitle":"副标题","intro":["段落1"],"sections":[]}'
                          value={(form as any)[langKey('body', lang)] as string}
                          onChange={(e) => updateField(langKey('body', lang), e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </TrilingualTabs>

                {/* 背景图片 */}
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">
                    详情页背景图
                    <span className="ml-1 text-[10px] text-[#adb5bd]">（显示在业务详情页 Hero 区域全宽背景）</span>
                  </label>
                  <ImageUrlGuide
                    type="business-hero"
                    value={form.coverImage}
                    onChange={(val) => updateField('coverImage', val)}
                    inputClass={inputClass}
                  />
                </div>

                <div className="flex gap-2">
                  <button onClick={save} className="flex items-center gap-1 rounded-lg bg-[#070B14] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#1A2A4A]">
                    <Check className="h-4 w-4" /> 保存
                  </button>
                  <button onClick={() => { setEditingId(null); setForm(null); }} className="flex items-center gap-1 rounded-lg border border-[#e5e7eb] px-4 py-2 text-[13px] font-medium text-[#6c757d] hover:bg-[#f8f9fa]">
                    <X className="h-4 w-4" /> 取消
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#1a1a2e]">{div.titleZhCN}</h3>
                  <p className="mt-1 text-[13px] text-[#6c757d]">{div.shortDescZhCN}</p>
                  <p className="mt-2 text-[12px] text-[#adb5bd]">
                    图标：{div.icon} &middot; 路径：/{div.slug}
                    {div.coverImage && <span className="ml-2 text-green-600">✓ 已设置背景图</span>}
                  </p>
                </div>
                <button
                  onClick={() => startEdit(div)}
                  className="rounded-lg p-2 text-[#6c757d] hover:bg-[#f8f9fa] hover:text-[#1a1a2e]"
                  title="编辑"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
