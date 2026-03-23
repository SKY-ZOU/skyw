import AdminNavbar from '@/components/lp/layout/AdminNavbar'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { lpAuthOptions } from '@/lib/lp-auth-options'

export default async function LpAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication and admin role
  const session = await getServerSession(lpAuthOptions)
  if (!session) {
    redirect('/lp/login')
  }

  if (session.user.role !== 'admin' && session.user.role !== 'fund_manager') {
    redirect('/lp')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />
      <div
        className="min-h-screen transition-all duration-300"
        style={{ marginLeft: 'var(--sidebar-width, 18rem)' }}
      >
        {children}
      </div>
    </div>
  )
}
