/**
 * 天汇基金 LP Portal - 交易拒绝 API
 *
 * PATCH /api/lp/transactions/[id]/reject
 * 管理员拒绝交易申请
 *
 * 权限: Admin / Fund Manager
 *
 * @module app/api/lp/transactions/[id]/reject/route
 * @created 2026-02-18
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { createServerClient } from '@/lib/lp-supabase'

/**
 * PATCH /api/lp/transactions/[id]/reject
 * 拒绝交易申请
 *
 * Body:
 * {
 *   note: string        // 拒绝原因（必需）
 * }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params

    // 1. 验证登录和权限
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'admin' && session.user.role !== 'fund_manager') {
      return NextResponse.json(
        { error: 'Forbidden - Only admins can reject transactions' },
        { status: 403 }
      )
    }

    // 2. 解析请求体
    const body = await request.json()
    const { note } = body

    if (!note || !note.trim()) {
      return NextResponse.json(
        { error: 'Note is required when rejecting a transaction' },
        { status: 400 }
      )
    }

    // 3. 获取交易详情
    const supabase: any = await createServerClient()
    const { data: tx, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', resolvedParams.id)
      .single()

    if (txError || !tx) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    if (tx.status !== 'pending') {
      return NextResponse.json(
        { error: 'Transaction is not pending' },
        { status: 400 }
      )
    }

    // 4. 更新交易记录为拒绝状态
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: 'rejected',
        notes: note,
        processed_at: new Date().toISOString(),
      })
      .eq('id', resolvedParams.id)

    if (updateError) {
      console.error('Error rejecting transaction:', updateError)
      return NextResponse.json(
        { error: 'Failed to reject transaction' },
        { status: 500 }
      )
    }

    // 5. 返回成功
    return NextResponse.json({
      success: true,
      message: 'Transaction rejected successfully',
      data: {
        id: resolvedParams.id,
        status: 'rejected',
        note
      }
    })

  } catch (error) {
    console.error('Transaction reject API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
