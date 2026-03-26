'use client';

import { useEffect, useState } from 'react';
import { Mail, MailOpen } from 'lucide-react';

interface Submission {
  id: number;
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function InboxPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/inbox')
      .then((r) => r.json())
      .then((data) => { setItems(data); setLoading(false); });
  }, []);

  async function markRead(id: number, read: boolean) {
    await fetch('/api/admin/inbox', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, read }),
    });
    setItems((prev) => prev.map((s) => s.id === id ? { ...s, read } : s));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, read } : null);
  }

  async function openItem(item: Submission) {
    setSelected(item);
    if (!item.read) await markRead(item.id, true);
  }

  const unread = items.filter((s) => !s.read).length;

  if (loading) return <p className="text-body-sm text-[#6c757d]">加载中...</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">联系表单收件箱</h1>
          <p className="mt-1 text-body-sm text-[#6c757d]">
            共 {items.length} 条消息 · {unread} 条未读
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-4 h-[calc(100vh-200px)]">
        {/* 消息列表 */}
        <div className="w-80 shrink-0 overflow-y-auto rounded-xl bg-white shadow-sm divide-y divide-[#f0f0f0]">
          {items.length === 0 && (
            <p className="p-6 text-body-sm text-[#adb5bd] text-center">暂无消息</p>
          )}
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => openItem(item)}
              className={`w-full text-left px-4 py-3.5 transition-colors hover:bg-[#f8f9fa] ${
                selected?.id === item.id ? 'bg-[#f0f4ff]' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-body-sm truncate ${item.read ? 'text-[#6c757d]' : 'font-semibold text-[#1a1a2e]'}`}>
                  {item.name}
                </span>
                {!item.read && <span className="h-2 w-2 rounded-full bg-gold-400 shrink-0" />}
              </div>
              <p className="mt-0.5 text-caption text-[#6c757d] truncate">{item.subject || item.message.slice(0, 40)}</p>
              <p className="mt-1 text-micro text-[#adb5bd]">{new Date(item.createdAt).toLocaleDateString('zh-CN')}</p>
            </button>
          ))}
        </div>

        {/* 消息详情 */}
        <div className="flex-1 overflow-y-auto rounded-xl bg-white shadow-sm p-6">
          {!selected ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-body-sm text-[#adb5bd]">点击左侧消息查看详情</p>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#f0f0f0]">
                <div>
                  <h2 className="text-lg font-semibold text-[#1a1a2e]">{selected.subject || '（无主题）'}</h2>
                  <p className="mt-1 text-body-sm text-[#6c757d]">
                    发件人：<span className="font-medium text-[#1a1a2e]">{selected.name}</span>
                    {selected.company && ` · ${selected.company}`}
                    {' · '}<a href={`mailto:${selected.email}`} className="text-gold-500 hover:underline">{selected.email}</a>
                  </p>
                  <p className="text-caption text-[#adb5bd] mt-1">{new Date(selected.createdAt).toLocaleString('zh-CN')}</p>
                </div>
                <button
                  onClick={() => markRead(selected.id, !selected.read)}
                  className="shrink-0 flex items-center gap-1.5 rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-caption text-[#6c757d] hover:bg-[#f8f9fa]"
                >
                  {selected.read
                    ? <><Mail className="h-3.5 w-3.5" /> 标为未读</>
                    : <><MailOpen className="h-3.5 w-3.5" /> 标为已读</>}
                </button>
              </div>
              <p className="mt-4 text-body text-[#1a1a2e] whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              <div className="mt-6">
                <a
                  href={`mailto:${selected.email}?subject=回复：${encodeURIComponent(selected.subject || '')}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#070B14] px-4 py-2 text-body-sm font-medium text-white hover:bg-[#1A2A4A]"
                >
                  <Mail className="h-4 w-4" /> 发送邮件回复
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
