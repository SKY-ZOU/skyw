import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'

export default async function LpIndexPage() {
  const session = await getServerSession(lpAuthOptions)
  if (!session) redirect('/lp/login')
  if (session.user.role === 'admin' || session.user.role === 'fund_manager') {
    redirect('/lp-admin')
  }
  redirect('/lp/dashboard')
}
