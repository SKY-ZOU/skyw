/**
 * 天汇基金 LP Portal - 单个交易 API
 *
 * GET /api/lp/transactions/[id] - 获取交易详情
 * PATCH /api/lp/transactions/[id] - 更新交易状态（审批/拒绝）
 *
 * 权限:
 * - GET: LP 看自己的，Admin/Fund Manager 看全部
 * - PATCH: 仅 Admin/Fund Manager 可审批
 *
 * @module app/api/lp/transactions/[id]/route
 * @created 2026-02-18
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { updateTransactionStatus } from '@/lib/lp-db-helpers'
import { createServerClient } from '@/lib/lp-supabase'

/**
 * GET /api/lp/transactions/[id]
 * 获取交易详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15)
    const resolvedParams = await params
    // 1. 验证登录
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    // 2. 查询交易
    const supabase: any = await createServerClient()
    const { data: transaction, error } = await supabase
      .from('transactions')
      .select(`
        *,
        user:users(id, name, email),
        fund:funds(id, name, currency)
      `)
      .eq('id', resolvedParams.id)
      .single()

    if (error || !transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // 3. 权限检查
    const isAdmin = session.user.role === 'admin' || session.user.role === 'fund_manager'
    const isOwner = transaction.user_id === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'Forbidden - You can only view your own transactions' },
        { status: 403 }
      )
    }

    // 4. 返回结果
    return NextResponse.json({
      success: true,
      data: transaction
    })

  } catch (error) {
    console.error('Transaction GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/lp/transactions/[id]
 * 更新交易状态（审批/拒绝）
 *
 * Body:
 * {
 *   status: 'approved' | 'rejected' | 'completed'
 * }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15)
    const resolvedParams = await params
    // 1. 验证登录
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    // 2. 权限检查 - 仅管理员可审批
    if (session.user.role !== 'admin' && session.user.role !== 'fund_manager') {
      return NextResponse.json(
        { error: 'Forbidden - Only admins can approve transactions' },
        { status: 403 }
      )
    }

    // 3. 解析请求体
    const body = await request.json()
    const { status } = body

    // 4. 数据验证
    if (!status || !['approved', 'rejected', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "approved", "rejected", or "completed"' },
        { status: 400 }
      )
    }

    // 5. 更新交易状态
    const { data, error } = await updateTransactionStatus(resolvedParams.id, status)

    if (error) {
      console.error('Error updating transaction:', error)
      return NextResponse.json(
        { error: 'Failed to update transaction' },
        { status: 500 }
      )
    }

    // 6. 返回结果
    return NextResponse.json({
      success: true,
      message: `Transaction ${status} successfully`,
      data
    })

  } catch (error) {
    console.error('Transaction PATCH API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
