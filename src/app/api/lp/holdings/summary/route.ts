/**
 * 天汇基金 LP Portal - 持仓汇总 API
 *
 * GET /api/lp/holdings/summary - 获取持仓汇总（总投资、总价值、收益率）
 *
 * 权限: LP 看自己的，Admin/Fund Manager 看指定用户的
 *
 * @module app/api/lp/holdings/summary/route
 * @created 2026-02-18
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { getUserPortfolio } from '@/lib/lp-db-helpers'

/**
 * GET /api/lp/holdings/summary
 * 获取持仓汇总
 */
export async function GET(request: NextRequest) {
  try {
    // 1. 验证登录
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    // 2. 获取查询参数
    const { searchParams } = new URL(request.url)
    const targetUserId = searchParams.get('user_id')

    // 3. 权限检查
    let userId = session.user.id

    if (targetUserId) {
      if (session.user.role !== 'admin' && session.user.role !== 'fund_manager') {
        return NextResponse.json(
          { error: 'Forbidden - Insufficient permissions' },
          { status: 403 }
        )
      }
      userId = targetUserId
    }

    // 4. 获取投资组合数据
    const portfolio = await getUserPortfolio(userId)

    // 5. 返回结果
    return NextResponse.json({
      success: true,
      data: portfolio
    })

  } catch (error) {
    console.error('Holdings summary API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
