'use client';

import { useEffect, useState } from 'react';
import TrilingualTabs, { type Lang } from '@/components/admin/TrilingualTabs';

interface Setting {
  id: number;
  companyName: string;
  companyFull: string;
  email: string;
  phone: string;
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

  if (!setting) return <p className="text-[14px] text-[#6c757d]">Loading...</p>;

  const inputClass =
    'w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-[14px] outline-none focus:border-[#070B14] focus:ring-1 focus:ring-[#070B14]';

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e]">Settings</h1>
      <p className="mt-1 text-[14px] text-[#6c757d]">Company information and homepage metrics.</p>

      {/* Company info */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1a1a2e]">Company Information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">Company Name</label>
            <input className={inputClass} value={setting.companyName} onChange={(e) => updateSetting('companyName', e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">Full Name</label>
            <input className={inputClass} value={setting.companyFull} onChange={(e) => updateSetting('companyFull', e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">Email</label>
            <input className={inputClass} value={setting.email} onChange={(e) => updateSetting('email', e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">Phone</label>
            <input className={inputClass} value={setting.phone} onChange={(e) => updateSetting('phone', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1a1a2e]">Homepage Metrics</h2>
        <div className="mt-4 space-y-4">
          {metrics.map((metric, idx) => (
            <div key={metric.id} className="rounded-lg border border-[#e5e7eb] p-4">
              <TrilingualTabs>
                {(lang: Lang) => (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">Value</label>
                      <input
                        className={inputClass}
                        value={(metric as any)[langKey('value', lang)] as string}
                        onChange={(e) => updateMetric(idx, langKey('value', lang), e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">Label</label>
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

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[#070B14] px-6 py-2.5 text-[13px] font-medium text-white hover:bg-[#1A2A4A] disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {saved && <span className="text-[13px] text-green-600">Saved successfully!</span>}
      </div>
    </div>
  );
}
