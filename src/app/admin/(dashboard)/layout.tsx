import type { ReactNode } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f8f9]">
      <Sidebar />
      <div className="ml-60">
        <AdminHeader />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
