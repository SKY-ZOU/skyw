'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

interface SeoData {
  geoAllowBots: string;
  geoOrgDesc: string;
  geoOrgFounded: string;
  geoOrgIndustry: string;
  faqJson: string;
  llmsCustom: string;
}

const ALL_BOTS = [
  { id: 'GPTBot',          name: 'ChatGPT / OpenAI',        desc: '全球最多用户的 AI 对话工具', icon: '🤖' },
  { id: 'ClaudeBot',       name: 'Claude / Anthropic',       desc: '高质量 AI 助手，企业用户多', icon: '🧠' },
  { id: 'PerplexityBot',   name: 'Perplexity AI',           desc: '新兴 AI 搜索引擎，增速最快', icon: '🔍' },
  { id: 'Google-Extended', name: 'Google AI Overview / Gemini', desc: 'Google 搜索结果顶部 AI 摘要', icon: '🌐' },
  { id: 'YouBot',          name: 'You.com',                 desc: 'AI 搜索引擎', icon: '🔎' },
  { id: 'CCBot',           name: 'Common Crawl',            desc: '多个 AI 模型的训练数据来源', icon: '📚' },
];

function geoScore(data: SeoData, faqs: FaqItem[]): { score: number; checks: { label: string; pass: boolean; tip: string }[] } {
  const checks = [
    {
      label: '允许 AI 爬虫访问',
      pass: data.geoAllowBots.includes('GPTBot') || data.geoAllowBots.includes('ClaudeBot'),
      tip: '至少允许 ChatGPT 或 Claude 爬取，才能被 AI 搜索引擎发现',
    },
    {
      label: '公司 AI 简介已填写',
      pass: data.geoOrgDesc.length > 30,
      tip: '给 AI 看的公司简介，建议 50–150 字，包含核心业务和服务对象',
    },
    {
      label: '行业标签已设置',
      pass: data.geoOrgIndustry.length > 0,
      tip: '帮助 AI 理解您所在的行业，如"香港投资基金管理"',
    },
    {
      label: '成立年份已填写',
      pass: data.geoOrgFounded.length > 0,
      tip: '公司历史是 AI 评估可信度的重要依据',
    },
    {
      label: 'FAQ 常见问题已添加',
      pass: faqs.length >= 3,
      tip: '至少 3 条 FAQ，会写入 Google 精选摘要和 AI 回答',
    },
    {
      label: 'llms.txt 内容地图',
      pass: true, // 自动生成，始终满足
      tip: '系统已自动生成，AI 可以通过 /llms.txt 了解网站结构',
    },
  ];
  const score = Math.round((checks.filter((c) => c.pass).length / checks.length) * 100);
  return { score, checks };
}

export default function SeoPage() {
  const [data, setData] = useState<SeoData>({
    geoAllowBots: 'GPTBot,ClaudeBot,PerplexityBot,Google-Extended',
    geoOrgDesc: '',
    geoOrgFounded: '',
    geoOrgIndustry: '',
    faqJson: '[]',
    llmsCustom: '',
  });
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'geo' | 'faq' | 'llms'>('geo');

  useEffect(() => {
    fetch('/api/admin/seo')
      .then((r) => r.json())
      .then((d) => {
        if (!d || d.error) return;
        setData(d);
        try {
          setFaqs(JSON.parse(d.faqJson || '[]'));
        } catch {
          setFaqs([]);
        }
      });
  }, []);

  function toggleBot(botId: string) {
    const current = data.geoAllowBots.split(',').map((s) => s.trim()).filter(Boolean);
    const next = current.includes(botId)
      ? current.filter((b) => b !== botId)
      : [...current, botId];
    setData((prev) => ({ ...prev, geoAllowBots: next.join(',') }));
  }

  function addFaq() {
    setFaqs((prev) => [...prev, { q: '', a: '' }]);
  }

  function updateFaq(idx: number, field: 'q' | 'a', val: string) {
    setFaqs((prev) => prev.map((f, i) => (i === idx ? { ...f, [field]: val } : f)));
  }

  function removeFaq(idx: number) {
    setFaqs((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch('/api/admin/seo', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, faqJson: JSON.stringify(faqs) }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const allowedBots = data.geoAllowBots.split(',').map((s) => s.trim());
  const { score, checks } = geoScore(data, faqs);
  const scoreColor = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-amber-500' : 'text-red-500';
  const scoreBg = score >= 80 ? 'bg-green-50 border-green-200' : score >= 50 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';

  const inputClass = 'w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-[14px] outline-none focus:border-[#070B14] focus:ring-1 focus:ring-[#070B14]';

  const BASE = typeof window !== 'undefined' ? window.location.origin : 'https://skyw-website.netlify.app';

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">SEO / GEO 优化</h1>
          <p className="mt-1 text-[14px] text-[#6c757d]">
            让 Google、ChatGPT、Perplexity 等搜索引擎主动推荐您的公司。
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[#070B14] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#1A2A4A] disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存设置'}
          </button>
          {saved && <span className="text-[13px] text-green-600">✓ 已保存</span>}
        </div>
      </div>

      {/* GEO 得分卡 */}
      <div className={`mt-6 rounded-xl border p-5 ${scoreBg}`}>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className={`text-4xl font-bold ${scoreColor}`}>{score}</p>
            <p className="text-[12px] text-[#6c757d]">GEO 得分</p>
          </div>
          <div className="flex-1">
            <div className="h-2 w-full rounded-full bg-[#e5e7eb]">
              <div
                className={`h-2 rounded-full transition-all ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="mt-2 text-[13px] text-[#6c757d]">
              {score >= 80
                ? '优秀！您的网站已具备被 AI 搜索引擎引用的良好条件。'
                : score >= 50
                ? '良好。完善以下未通过项，可大幅提升 AI 搜索曝光率。'
                : '需改善。请尽快完成以下配置，避免被 AI 搜索引擎忽略。'}
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {checks.map((c) => (
            <div key={c.label} className="flex items-start gap-2 rounded-lg bg-white/60 px-3 py-2">
              {c.pass
                ? <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />}
              <div>
                <p className="text-[13px] font-medium text-[#1a1a2e]">{c.label}</p>
                {!c.pass && <p className="text-[11px] text-[#6c757d]">{c.tip}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 标签页 */}
      <div className="mt-6 flex gap-1 border-b border-[#e5e7eb]">
        {([
          { id: 'geo', label: '🤖 AI 爬虫 & 公司信息' },
          { id: 'faq', label: '❓ 常见问题 (FAQ)' },
          { id: 'llms', label: '🗺️ AI 内容地图' },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-[#070B14] text-[#1a1a2e]'
                : 'border-transparent text-[#6c757d] hover:text-[#1a1a2e]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab 1: AI 爬虫 & 公司信息 ── */}
      {activeTab === 'geo' && (
        <div className="mt-6 space-y-6">
          {/* AI 爬虫权限 */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#1a1a2e]">AI 搜索引擎爬虫权限</h2>
            <p className="mt-1 text-[13px] text-[#6c757d]">
              勾选后，对应的 AI 平台可以学习您的网站内容，并在用户提问时推荐您的公司。<strong className="text-[#1a1a2e]">建议全部开启。</strong>
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {ALL_BOTS.map((bot) => {
                const enabled = allowedBots.includes(bot.id);
                return (
                  <label
                    key={bot.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                      enabled ? 'border-[#070B14] bg-[#070B14]/5' : 'border-[#e5e7eb] hover:bg-[#f8f9fa]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => toggleBot(bot.id)}
                      className="h-4 w-4 rounded"
                    />
                    <span className="text-lg">{bot.icon}</span>
                    <div>
                      <p className="text-[13px] font-medium text-[#1a1a2e]">{bot.name}</p>
                      <p className="text-[11px] text-[#6c757d]">{bot.desc}</p>
                    </div>
                    {enabled && (
                      <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                        已允许
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#f0f4ff] px-3 py-2 text-[12px] text-[#344054]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-blue-500" />
              设置后会自动写入网站的 robots.txt 文件，无需手动操作。
              <a href={`${BASE}/robots.txt`} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-1 text-blue-600 hover:underline">
                查看 robots.txt <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* 公司 AI 简介 */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#1a1a2e]">公司 AI 简介（结构化数据）</h2>
            <p className="mt-1 text-[13px] text-[#6c757d]">
              这些信息会写入网页的隐藏代码（JSON-LD），帮助 Google 和 AI 理解您的公司，是提升搜索排名的重要技术基础。
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">
                  公司 AI 简介
                  <span className="ml-1 text-[10px] text-[#adb5bd]">（50–150 字，包含核心业务、服务对象、地理位置）</span>
                </label>
                <textarea
                  className={inputClass + ' h-28 resize-none'}
                  placeholder="例：天汇资本（SKYW Capital）是一家总部位于香港的专业投资基金管理公司，专注于大湾区资本市场、港股 IPO 配售、黄金大宗商品及跨境贸易融资等领域，为机构投资者和高净值客户提供专业的资产管理服务。"
                  value={data.geoOrgDesc}
                  onChange={(e) => setData((p) => ({ ...p, geoOrgDesc: e.target.value }))}
                />
                <p className="mt-1 text-[11px] text-[#adb5bd]">
                  已输入 {data.geoOrgDesc.length} 字 {data.geoOrgDesc.length < 30 && '（建议至少 50 字）'}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">公司成立年份</label>
                  <input
                    className={inputClass}
                    placeholder="例：2015"
                    value={data.geoOrgFounded}
                    onChange={(e) => setData((p) => ({ ...p, geoOrgFounded: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">
                    行业标签
                    <span className="ml-1 text-[10px] text-[#adb5bd]">（英文，标准化行业描述）</span>
                  </label>
                  <input
                    className={inputClass}
                    placeholder="Investment Fund Management"
                    value={data.geoOrgIndustry}
                    onChange={(e) => setData((p) => ({ ...p, geoOrgIndustry: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-lg bg-[#f0f4ff] px-3 py-2 text-[12px] text-[#344054]">
              💡 <strong>为什么重要？</strong>当用户在 ChatGPT 问「香港有哪些知名投资基金？」，AI 会优先引用拥有完整结构化数据的公司。
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: FAQ 常见问题 ── */}
      {activeTab === 'faq' && (
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#1a1a2e]">常见问题管理（FAQ）</h2>
              <p className="mt-1 text-[13px] text-[#6c757d]">
                FAQ 会以特殊格式写入网页，Google 会直接在搜索结果中展示这些问答（精选摘要），ChatGPT 也会优先引用。
              </p>
            </div>
            <button
              onClick={addFaq}
              className="flex items-center gap-1.5 rounded-lg bg-[#070B14] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#1A2A4A]"
            >
              <Plus className="h-4 w-4" /> 添加问题
            </button>
          </div>

          {faqs.length === 0 && (
            <div className="mt-6 rounded-lg border-2 border-dashed border-[#e5e7eb] py-10 text-center">
              <p className="text-[14px] text-[#adb5bd]">暂无 FAQ</p>
              <p className="mt-1 text-[12px] text-[#adb5bd]">建议添加 5–10 条关于公司服务、投资流程的常见问题</p>
              <button onClick={addFaq} className="mt-3 rounded-lg bg-[#070B14] px-4 py-2 text-[13px] text-white hover:bg-[#1A2A4A]">
                添加第一条 FAQ
              </button>
            </div>
          )}

          <div className="mt-4 space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-lg border border-[#e5e7eb] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-medium text-[#adb5bd]">问题 {idx + 1}</span>
                  <button
                    onClick={() => removeFaq(idx)}
                    className="rounded p-1 text-[#adb5bd] hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">
                      问题（用户会这样问 Google / ChatGPT）
                    </label>
                    <input
                      className={inputClass}
                      placeholder="例：天汇资本提供哪些投资服务？"
                      value={faq.q}
                      onChange={(e) => updateFaq(idx, 'q', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">
                      回答（简洁清晰，建议 50–200 字）
                    </label>
                    <textarea
                      className={inputClass + ' h-24 resize-none'}
                      placeholder="例：天汇资本提供港股 IPO 配售、黄金大宗商品投资、跨境贸易融资及基金管理等专业金融服务，主要服务机构投资者和高净值个人客户。"
                      value={faq.a}
                      onChange={(e) => updateFaq(idx, 'a', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {faqs.length > 0 && (
            <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-[12px] text-amber-800">
              💡 <strong>FAQ 写作技巧：</strong>问题用「用户真实提问」的口吻，回答开头直接给出答案，再补充细节。这样 AI 更容易直接引用您的回答。
            </div>
          )}
        </div>
      )}

      {/* ── Tab 3: llms.txt AI 内容地图 ── */}
      {activeTab === 'llms' && (
        <div className="mt-6 space-y-5">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#1a1a2e]">AI 内容地图（llms.txt）</h2>
                <p className="mt-1 text-[13px] text-[#6c757d]">
                  llms.txt 是 2024 年出现的新标准，类似告诉 AI「请先读这些页面」。Stripe、Cloudflare、Anthropic 等公司已经部署。
                </p>
              </div>
              <a
                href={`${BASE}/llms.txt`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-[#e5e7eb] px-3 py-2 text-[13px] text-[#6c757d] hover:bg-[#f8f9fa]"
              >
                <ExternalLink className="h-4 w-4" /> 查看当前 llms.txt
              </a>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-[#e5e7eb] p-3 text-center">
                <p className="text-xl font-bold text-[#1a1a2e]">✓</p>
                <p className="text-[12px] text-[#6c757d]">已自动生成基础内容</p>
              </div>
              <div className="rounded-lg border border-[#e5e7eb] p-3 text-center">
                <p className="text-xl font-bold text-[#1a1a2e]">动态</p>
                <p className="text-[12px] text-[#6c757d]">每次访问实时读取最新文章</p>
              </div>
              <div className="rounded-lg border border-[#e5e7eb] p-3 text-center">
                <p className="text-xl font-bold text-[#1a1a2e]">三语</p>
                <p className="text-[12px] text-[#6c757d]">中英文页面全部收录</p>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">
                附加说明（可选）
                <span className="ml-1 text-[10px] text-[#adb5bd]">会追加到 llms.txt 末尾，用于特别声明或补充信息</span>
              </label>
              <textarea
                className={inputClass + ' h-28 resize-none font-mono text-[12px]'}
                placeholder="例：
## Compliance Notice
This site is regulated by the Securities and Futures Commission of Hong Kong (SFC).
All investment products are subject to market risks."
                value={data.llmsCustom}
                onChange={(e) => setData((p) => ({ ...p, llmsCustom: e.target.value }))}
              />
            </div>

            <div className="mt-4 rounded-lg bg-[#f0f4ff] px-4 py-3 text-[12px] text-[#344054]">
              <strong>自动包含的内容：</strong>公司简介、所有业务板块链接、最新 10 篇文章、三语版本说明、排除 /admin 和 /api 路径。您只需填写附加说明即可，其余系统自动维护。
            </div>
          </div>

          {/* 提交到 Search Console */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#1a1a2e]">提交 Sitemap 到 Google</h2>
            <p className="mt-1 text-[13px] text-[#6c757d]">将网站地图提交给 Google，可加速新页面被索引，通常 24–72 小时内生效。</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-[#070B14] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#1A2A4A]"
              >
                <ExternalLink className="h-4 w-4" /> 打开 Google Search Console
              </a>
              <div className="flex items-center gap-2 rounded-lg border border-[#e5e7eb] px-4 py-2">
                <span className="text-[12px] text-[#6c757d]">Sitemap 地址：</span>
                <code className="text-[12px] text-[#1a1a2e]">{BASE}/sitemap.xml</code>
              </div>
            </div>
            <div className="mt-3 rounded-lg bg-[#f8f9fa] px-4 py-3 text-[12px] text-[#6c757d]">
              操作步骤：① 打开 Google Search Console → ② 左侧选「站点地图」→ ③ 粘贴上方地址 → ④ 提交
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
