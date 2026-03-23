/**
 * GET /api/lp/admin/lps/[id]/portfolio
 * 获取指定 LP 的完整持仓数据（Admin PDF 生成用）
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { getUserPortfolio, getUserTransactions, getUserById } from '@/lib/lp-db-helpers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'admin' && session.user.role !== 'fund_manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    const [userResult, portfolio, transactions] = await Promise.all([
      getUserById(id),
      getUserPortfolio(id),
      getUserTransactions(id, 20)
    ])

    if (!userResult.data) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...safeUser } = userResult.data

    return NextResponse.json({
      success: true,
      data: {
        user: safeUser,
        portfolio,
        transactions: transactions.data || []
      }
    })

  } catch (error) {
    console.error('admin/lps/[id]/portfolio error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
