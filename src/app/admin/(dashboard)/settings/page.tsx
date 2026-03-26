'use client';

import { useEffect, useState } from 'react';
import TrilingualTabs, { type Lang } from '@/components/admin/TrilingualTabs';

interface Setting {
  id: number;
  companyName: string;
  companyFull: string;
  email: string;
  phone: string;
  ogImage: string;
  linkedinUrl: string;
  wechatId: string;
  twitterUrl: string;
}

interface Metric {
  id: number;
  sortOrder: number;
  valueZhCN: string; valueZhTW: string; valueEn: string;
  labelZhCN: string; labelZhTW: string; labelEn: string;
}

function langKey(field: string, lang: Lang) {
  return `${field}${lang.charAt(0).toUpperCase() + lang.slice(1)}`;
}

export default function SettingsPage() {
  const [setting, setSetting] = useState<Setting | null>(null);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        setSetting(data.setting);
        setMetrics(data.metrics);
      });
  }, []);

  function updateSetting(field: keyof Setting, value: string) {
    setSetting((prev) => prev ? { ...prev, [field]: value } : prev);
  }

  function updateMetric(idx: number, field: string, value: string) {
    setMetrics((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setting, metrics }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!setting) return <p className="text-[14px] text-[#6c757d]">加载中...</p>;

  const inputClass =
    'w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-[14px] outline-none focus:border-[#070B14] focus:ring-1 focus:ring-[#070B14]';

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e]">网站设置</h1>
      <p className="mt-1 text-[14px] text-[#6c757d]">公司基本信息与首页核心数据指标。</p>

      {/* 公司信息 */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1a1a2e]">公司信息</h2>
        <p className="mt-1 text-[13px] text-[#6c757d]">此处信息会显示在网站页脚及联系页面。</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">公司简称</label>
            <input className={inputClass} value={setting.companyName} onChange={(e) => updateSetting('companyName', e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">公司全称</label>
            <input className={inputClass} value={setting.companyFull} onChange={(e) => updateSetting('companyFull', e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">联系邮箱</label>
            <input className={inputClass} value={setting.email} onChange={(e) => updateSetting('email', e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">联系电话</label>
            <input className={inputClass} value={setting.phone} onChange={(e) => updateSetting('phone', e.target.value)} />
          </div>
        </div>
      </div>

      {/* 首页指标 */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1a1a2e]">首页核心数据指标</h2>
        <p className="mt-1 text-[13px] text-[#6c757d]">显示在首页的关键数据展示区，如管理规模、成立年限等。</p>
        <div className="mt-4 space-y-4">
          {metrics.map((metric, idx) => (
            <div key={metric.id} className="rounded-lg border border-[#e5e7eb] p-4">
              <p className="mb-3 text-[12px] font-medium text-[#adb5bd]">指标 {idx + 1}</p>
              <TrilingualTabs>
                {(lang: Lang) => (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">
                        数值
                        <span className="ml-1 text-[10px] text-[#adb5bd]">（如：$2.8B、15年）</span>
                      </label>
                      <input
                        className={inputClass}
                        value={(metric as any)[langKey('value', lang)] as string}
                        onChange={(e) => updateMetric(idx, langKey('value', lang), e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">
                        标签说明
                        <span className="ml-1 text-[10px] text-[#adb5bd]">（如：管理规模、成立年限）</span>
                      </label>
                      <input
                        className={inputClass}
                        value={(metric as any)[langKey('label', lang)] as string}
                        onChange={(e) => updateMetric(idx, langKey('label', lang), e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </TrilingualTabs>
            </div>
          ))}
        </div>
      </div>

      {/* SEO 与社交媒体 */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-semibold text-[#1a1a2e]">搜索引擎优化 & 社交媒体</h2>
          <span className="rounded bg-gold-400/15 px-2 py-0.5 text-[11px] font-medium text-gold-600">影响 Google 排名与社交分享</span>
        </div>
        <p className="text-[13px] text-[#6c757d]">设置全站默认 OG 分享图及社交媒体主页链接，将显示在网站页脚。</p>

        {/* 默认 OG 图 */}
        <div className="mt-4">
          <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">
            全站默认社交分享图（OG Image）
            <span className="ml-1 text-[10px] text-[#adb5bd]">（无封面图的页面使用此图作为社交分享预览）</span>
          </label>
          <input
            className={inputClass}
            placeholder="https://example.com/og-image.jpg"
            value={setting.ogImage}
            onChange={(e) => updateSetting('ogImage' as keyof Setting, e.target.value)}
          />
          <p className="mt-1 text-[11px] text-[#adb5bd]">
            推荐尺寸：1200 × 630 px（16:9）· JPG/PNG · ≤ 500 KB。此图会在 LinkedIn、微信、X 分享时显示。
          </p>
          {setting.ogImage && (
            <img
              src={setting.ogImage}
              alt="OG图预览"
              className="mt-2 h-28 w-full max-w-sm rounded-lg object-cover border border-[#e5e7eb]"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          )}
        </div>

        {/* 社交媒体链接 */}
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">
              LinkedIn 主页链接
            </label>
            <input
              className={inputClass}
              placeholder="https://www.linkedin.com/company/skyw"
              value={setting.linkedinUrl}
              onChange={(e) => updateSetting('linkedinUrl' as keyof Setting, e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">
              微信公众号 ID
            </label>
            <input
              className={inputClass}
              placeholder="例：skywgroup"
              value={setting.wechatId}
              onChange={(e) => updateSetting('wechatId' as keyof Setting, e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">
              X (Twitter) 主页链接
            </label>
            <input
              className={inputClass}
              placeholder="https://x.com/skywgroup"
              value={setting.twitterUrl}
              onChange={(e) => updateSetting('twitterUrl' as keyof Setting, e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-[#f0f4ff] p-3 text-[12px] text-[#344054]">
          <strong>SEO 最佳实践提示：</strong>每篇文章发布时，封面图会自动作为该文章的社交分享图（OG Image），摘要会作为 meta description。确保每篇文章都有高质量封面图和详细摘要，能显著提升社交媒体点击率。
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[#070B14] px-6 py-2.5 text-[13px] font-medium text-white hover:bg-[#1A2A4A] disabled:opacity-50"
        >
          {saving ? '保存中...' : '保存设置'}
        </button>
        {saved && <span className="text-[13px] text-green-600">已保存成功！</span>}
      </div>
    </div>
  );
}
