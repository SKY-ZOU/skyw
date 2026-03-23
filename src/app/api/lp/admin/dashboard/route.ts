/**
 * 天汇基金 LP Portal - 管理员仪表盘 API
 *
 * GET /api/lp/admin/dashboard - 获取管理员仪表盘数据
 *
 * 返回数据:
 * - 待审批交易列表
 * - 活跃基金列表
 * - 最新公告
 *
 * 权限: 仅 Admin/Fund Manager
 *
 * @module app/api/lp/admin/dashboard/route
 * @created 2026-02-18
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { getAdminDashboardData } from '@/lib/lp-db-helpers'

/**
 * GET /api/lp/admin/dashboard
 * 获取管理员仪表盘数据
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

    // 2. 权限检查
    if (session.user.role !== 'admin' && session.user.role !== 'fund_manager') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // 3. 获取仪表盘数据
    const dashboardData = await getAdminDashboardData()

    // 4. 返回结果
    return NextResponse.json({
      success: true,
      data: {
        pending_transactions: dashboardData.pendingTransactions,
        active_funds: dashboardData.activeFunds,
        recent_announcements: dashboardData.recentAnnouncements
      }
    })

  } catch (error) {
    console.error('Admin Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
