'use client';

import { useEffect, useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import TrilingualTabs, { type Lang } from '@/components/admin/TrilingualTabs';

interface Division {
  id: number;
  divisionId: string;
  slug: string;
  icon: string;
  sortOrder: number;
  titleZhCN: string; titleZhTW: string; titleEn: string;
  shortDescZhCN: string; shortDescZhTW: string; shortDescEn: string;
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
      <h1 className="text-2xl font-semibold text-[#1a1a2e]">Business Divisions</h1>
      <p className="mt-1 text-[14px] text-[#6c757d]">Edit the five business divisions.</p>

      <div className="mt-6 space-y-4">
        {divisions.map((div) => (
          <div key={div.id} className="rounded-xl bg-white p-6 shadow-sm">
            {editingId === div.id && form ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">Division ID</label>
                    <input className={inputClass} value={form.divisionId} disabled />
                  </div>
                  <div>
                    <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">Slug</label>
                    <input className={inputClass} value={form.slug} onChange={(e) => updateField('slug', e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">Icon</label>
                    <select className={inputClass} value={form.icon} onChange={(e) => updateField('icon', e.target.value)}>
                      {ICONS.map((ic) => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <TrilingualTabs>
                  {(lang: Lang) => (
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">Title</label>
                        <input
                          className={inputClass}
                          value={(form as any)[langKey('title', lang)] as string}
                          onChange={(e) => updateField(langKey('title', lang), e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">Short Description</label>
                        <textarea
                          className={inputClass + ' h-24 resize-none'}
                          value={(form as any)[langKey('shortDesc', lang)] as string}
                          onChange={(e) => updateField(langKey('shortDesc', lang), e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </TrilingualTabs>

                <div className="flex gap-2">
                  <button onClick={save} className="flex items-center gap-1 rounded-lg bg-[#070B14] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#1A2A4A]">
                    <Check className="h-4 w-4" /> Save
                  </button>
                  <button onClick={() => { setEditingId(null); setForm(null); }} className="flex items-center gap-1 rounded-lg border border-[#e5e7eb] px-4 py-2 text-[13px] font-medium text-[#6c757d] hover:bg-[#f8f9fa]">
                    <X className="h-4 w-4" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#1a1a2e]">{div.titleEn}</h3>
                  <p className="mt-1 text-[13px] text-[#6c757d]">{div.shortDescEn}</p>
                  <p className="mt-2 text-[12px] text-[#adb5bd]">
                    Icon: {div.icon} &middot; Slug: /{div.slug}
                  </p>
                </div>
                <button
                  onClick={() => startEdit(div)}
                  className="rounded-lg p-2 text-[#6c757d] hover:bg-[#f8f9fa] hover:text-[#1a1a2e]"
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
