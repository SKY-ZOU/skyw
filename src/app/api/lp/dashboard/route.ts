/**
 * 天汇基金 LP Portal - LP 仪表盘 API
 *
 * GET /api/lp/dashboard - 获取 LP 仪表盘数据
 *
 * 返回数据:
 * - 投资组合概览（总投资、总价值、收益率）
 * - 最近交易记录
 * - 最新公告
 *
 * 权限: LP 用户（只能查看自己的数据）
 *
 * @module app/api/lp/dashboard/route
 * @created 2026-02-18
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { getDashboardData } from '@/lib/lp-db-helpers'

/**
 * GET /api/lp/dashboard
 * 获取 LP 仪表盘数据
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

    // 2. 获取仪表盘数据
    const dashboardData = await getDashboardData(session.user.id)

    // 3. 返回结果
    return NextResponse.json({
      success: true,
      data: {
        portfolio: dashboardData.portfolio,
        recent_transactions: dashboardData.recentTransactions,
        announcements: dashboardData.announcements
      }
    })

  } catch (error) {
    console.error('LP Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
