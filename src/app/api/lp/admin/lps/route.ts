/**
 * GET /api/lp/admin/lps
 * 获取所有 LP 投资人列表（管理员专用）
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { lpQuery } from '@/lib/lp-turso'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'admin' && session.user.role !== 'fund_manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const users = await lpQuery<{ id: string; email: string; name: string; phone: string; created_at: string }>(
      `SELECT id, email, name, phone, created_at FROM lp_users WHERE role = 'lp' ORDER BY created_at DESC`
    )

    const lpsWithPortfolio = await Promise.all(
      users.map(async (user) => {
        const holdings = await lpQuery<{ shares: number; cost_basis: number; nav: number }>(
          `SELECT h.shares, h.cost_basis, f.nav FROM lp_holdings h JOIN lp_funds f ON f.id = h.fund_id WHERE h.user_id = ?`,
          [user.id]
        )
        let totalCost = 0, totalValue = 0
        for (const h of holdings) {
          totalCost += Number(h.shares) * Number(h.cost_basis)
          totalValue += Number(h.shares) * Number(h.nav)
        }
        return {
          ...user,
          total_investment: totalCost,
          total_value: totalValue,
          return_rate: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0,
          fund_count: holdings.length,
          status: 'active',
          kyc_status: 'verified',
        }
      })
    )

    return NextResponse.json({ success: true, data: lpsWithPortfolio })
  } catch (error) {
    console.error('admin/lps error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
