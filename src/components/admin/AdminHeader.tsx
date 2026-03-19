'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#e5e7eb] bg-white px-8">
      <div />
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-body-sm font-medium text-[#6c757d] transition-colors hover:bg-[#f8f9fa] hover:text-[#1a1a2e]"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </header>
  );
}
