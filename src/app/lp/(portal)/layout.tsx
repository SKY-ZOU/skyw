import Navbar from '@/components/lp/layout/Navbar'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { lpAuthOptions } from '@/lib/lp-auth-options'

export default async function LpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication
  const session = await getServerSession(lpAuthOptions)
  if (!session) {
    redirect('/lp/login')
  }

  // 如果是admin或fund_manager，重定向到admin dashboard
  if (session.user.role === 'admin' || session.user.role === 'fund_manager') {
    redirect('/lp-admin')
  }

  // LP用户显示LP侧边栏
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div
        className="min-h-screen transition-all duration-300"
        style={{ marginLeft: 'var(--sidebar-width, 18rem)' }}
      >
        {children}
      </div>
    </div>
  )
}
