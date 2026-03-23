/**
 * 天汇基金 LP Portal - 交易撤销 API
 *
 * POST /api/lp/transactions/[id]/cancel
 * LP 用户撤销自己的待审批交易
 *
 * 权限: 仅交易所有者可撤销自己的待审批交易
 *
 * @module app/api/lp/transactions/[id]/cancel/route
 * @created 2026-02-18
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { createServerClient } from '@/lib/lp-supabase'

/**
 * POST /api/lp/transactions/[id]/cancel
 * 撤销待审批的交易
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params

    // 1. 验证登录
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    // 2. 获取交易详情
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

    // 3. 权限检查 - 只能是交易所有者
    if (tx.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You can only cancel your own transactions' },
        { status: 403 }
      )
    }

    // 4. 检查状态 - 只能撤销待审批的交易
    if (tx.status !== 'pending') {
      return NextResponse.json(
        { error: 'Only pending transactions can be cancelled' },
        { status: 400 }
      )
    }

    // 5. 删除交易记录
    const { error: deleteError } = await supabase
      .from('transactions')
      .delete()
      .eq('id', resolvedParams.id)

    if (deleteError) {
      console.error('Error cancelling transaction:', deleteError)
      return NextResponse.json(
        { error: 'Failed to cancel transaction' },
        { status: 500 }
      )
    }

    // 6. 返回成功
    return NextResponse.json({
      success: true,
      message: 'Transaction cancelled successfully'
    })

  } catch (error) {
    console.error('Transaction cancel API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
