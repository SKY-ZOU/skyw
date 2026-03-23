/**
 * 天汇基金 LP Portal - 持仓 API
 *
 * GET /api/lp/holdings - 获取当前用户的持仓列表
 *
 * 权限: LP 看自己的，Admin/Fund Manager 看指定用户的
 *
 * @module app/api/lp/holdings/route
 * @created 2026-02-18
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { getUserHoldings } from '@/lib/lp-db-helpers'

/**
 * GET /api/lp/holdings
 * 获取持仓列表
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
      // 如果要查询其他用户的持仓，需要管理员权限
      if (session.user.role !== 'admin' && session.user.role !== 'fund_manager') {
        return NextResponse.json(
          { error: 'Forbidden - Insufficient permissions' },
          { status: 403 }
        )
      }
      userId = targetUserId
    }

    // 4. 查询数据
    const { data, error } = await getUserHoldings(userId)

    if (error) {
      console.error('Error fetching holdings:', error)
      return NextResponse.json(
        { error: 'Failed to fetch holdings' },
        { status: 500 }
      )
    }

    // 5. 返回结果
    return NextResponse.json({
      success: true,
      data: data || []
    })

  } catch (error) {
    console.error('Holdings API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
