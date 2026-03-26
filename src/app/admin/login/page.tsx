'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      setError('密码错误，请重试');
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8f9]">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-3xl font-bold tracking-[0.15em] text-[#070B14]">
            SKYW
          </span>
          <p className="mt-2 text-[14px] text-[#6c757d]">管理后台</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-8 shadow-sm"
        >
          <label className="block text-[13px] font-medium text-[#1a1a2e]">
            登录密码
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-lg border border-[#e5e7eb] px-4 py-2.5 text-[14px] outline-none transition-colors focus:border-[#070B14] focus:ring-1 focus:ring-[#070B14]"
            placeholder="请输入管理员密码"
            required
          />
          {error && (
            <p className="mt-2 text-[13px] text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-[#070B14] py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#1A2A4A] disabled:opacity-50"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
}
