'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import TrilingualTabs, { type Lang } from '@/components/admin/TrilingualTabs';
import DeleteConfirm from '@/components/admin/DeleteConfirm';

interface Office {
  id: number;
  slug: string;
  sortOrder: number;
  nameZhCN: string; nameZhTW: string; nameEn: string;
  typeZhCN: string; typeZhTW: string; typeEn: string;
  addressZhCN: string; addressZhTW: string; addressEn: string;
  phone: string; email: string;
}

const empty: Omit<Office, 'id'> = {
  slug: '', sortOrder: 0,
  nameZhCN: '', nameZhTW: '', nameEn: '',
  typeZhCN: '', typeZhTW: '', typeEn: '',
  addressZhCN: '', addressZhTW: '', addressEn: '',
  phone: '', email: '',
};

function langKey(field: string, lang: Lang) {
  return `${field}${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof Office;
}

export default function OfficesPage() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [editing, setEditing] = useState<Office | (Omit<Office, 'id'> & { id?: undefined }) | null>(null);
  const [deleting, setDeleting] = useState<Office | null>(null);

  useEffect(() => {
    fetch('/api/admin/offices').then((r) => r.json()).then(setOffices);
  }, []);

  function startNew() {
    setEditing({ ...empty, sortOrder: offices.length });
  }

  function updateField(field: string, value: string | number) {
    setEditing((prev) => prev ? { ...prev, [field]: value } : prev);
  }

  async function save() {
    if (!editing) return;
    const isNew = !editing.id;
    const url = isNew ? '/api/admin/offices' : `/api/admin/offices/${editing.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    const saved = await res.json();

    if (isNew) {
      setOffices((prev) => [...prev, saved]);
    } else {
      setOffices((prev) => prev.map((o) => (o.id === saved.id ? saved : o)));
    }
    setEditing(null);
  }

  async function handleDelete() {
    if (!deleting) return;
    await fetch(`/api/admin/offices/${deleting.id}`, { method: 'DELETE' });
    setOffices((prev) => prev.filter((o) => o.id !== deleting.id));
    setDeleting(null);
  }

  const inputClass =
    'w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-[14px] outline-none focus:border-[#070B14] focus:ring-1 focus:ring-[#070B14]';

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#1a1a2e]">Offices</h1>
        <button
          onClick={startNew}
          className="flex items-center gap-2 rounded-lg bg-[#070B14] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#1A2A4A]"
        >
          <Plus className="h-4 w-4" /> Add Office
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {offices.map((office) => (
          <div key={office.id} className="rounded-xl bg-white p-6 shadow-sm">
            {editing?.id === office.id ? (
              <OfficeEditForm
                data={editing}
                onChange={updateField}
                onSave={save}
                onCancel={() => setEditing(null)}
                inputClass={inputClass}
              />
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#1a1a2e]">{office.nameEn}</h3>
                  <p className="text-[13px] text-[#6c757d]">
                    {office.typeEn} &middot; {office.phone} &middot; {office.email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(office)}
                    className="rounded-lg p-2 text-[#6c757d] hover:bg-[#f8f9fa] hover:text-[#1a1a2e]"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleting(office)}
                    className="rounded-lg p-2 text-[#6c757d] hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {editing && !editing.id && (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <OfficeEditForm
              data={editing}
              onChange={updateField}
              onSave={save}
              onCancel={() => setEditing(null)}
              inputClass={inputClass}
            />
          </div>
        )}
      </div>

      <DeleteConfirm
        open={!!deleting}
        title={deleting?.nameEn ?? ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

function OfficeEditForm({
  data,
  onChange,
  onSave,
  onCancel,
  inputClass,
}: {
  data: Office | (Omit<Office, 'id'> & { id?: undefined });
  onChange: (field: string, value: string | number) => void;
  onSave: () => void;
  onCancel: () => void;
  inputClass: string;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">Slug</label>
          <input className={inputClass} value={data.slug} onChange={(e) => onChange('slug', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">Phone</label>
          <input className={inputClass} value={data.phone} onChange={(e) => onChange('phone', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">Email</label>
          <input className={inputClass} value={data.email} onChange={(e) => onChange('email', e.target.value)} />
        </div>
      </div>

      <TrilingualTabs>
        {(lang: Lang) => (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">Name</label>
              <input
                className={inputClass}
                value={data[langKey('name', lang)] as string}
                onChange={(e) => onChange(langKey('name', lang), e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">Type</label>
              <input
                className={inputClass}
                value={data[langKey('type', lang)] as string}
                onChange={(e) => onChange(langKey('type', lang), e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#6c757d]">Address</label>
              <input
                className={inputClass}
                value={data[langKey('address', lang)] as string}
                onChange={(e) => onChange(langKey('address', lang), e.target.value)}
              />
            </div>
          </div>
        )}
      </TrilingualTabs>

      <div className="flex gap-2">
        <button onClick={onSave} className="flex items-center gap-1 rounded-lg bg-[#070B14] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#1A2A4A]">
          <Check className="h-4 w-4" /> Save
        </button>
        <button onClick={onCancel} className="flex items-center gap-1 rounded-lg border border-[#e5e7eb] px-4 py-2 text-[13px] font-medium text-[#6c757d] hover:bg-[#f8f9fa]">
          <X className="h-4 w-4" /> Cancel
        </button>
      </div>
    </div>
  );
}
