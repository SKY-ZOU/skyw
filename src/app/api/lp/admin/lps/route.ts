/**
 * GET /api/lp/admin/lps
 * 获取所有 LP 投资人列表（管理员专用）
 *
 * 包含每个 LP 的持仓汇总（总投资额、总市值）
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { createAdminClient } from '@/lib/lp-supabase'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'admin' && session.user.role !== 'fund_manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const supabase = createAdminClient()

    // 获取所有 LP 用户
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, phone, created_at')
      .eq('role', 'lp')
      .order('created_at', { ascending: false })

    if (usersError) {
      return NextResponse.json({ error: '获取用户失败' }, { status: 500 })
    }

    // 为每个 LP 获取持仓汇总
    const lpsWithPortfolio = await Promise.all(
      (users || []).map(async (user: any) => {
        const { data: holdings } = await supabase
          .from('holdings')
          .select('shares, cost_basis, fund:funds(nav)')
          .eq('user_id', user.id)

        let totalCost = 0
        let totalValue = 0

        if (holdings) {
          for (const h of holdings as any[]) {
            const cost = h.shares * h.cost_basis
            const value = h.shares * (h.fund?.nav || h.cost_basis)
            totalCost += cost
            totalValue += value
          }
        }

        return {
          ...user,
          total_investment: totalCost,
          total_value: totalValue,
          return_rate: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0,
          fund_count: holdings?.length || 0,
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
