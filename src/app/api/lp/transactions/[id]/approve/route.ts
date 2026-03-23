/**
 * 天汇基金 LP Portal - 交易批准 API
 *
 * PATCH /api/lp/transactions/[id]/approve
 * 管理员批准交易申请
 *
 * 权限: Admin / Fund Manager
 *
 * @module app/api/lp/transactions/[id]/approve/route
 * @created 2026-02-18
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { createServerClient } from '@/lib/lp-supabase'

/**
 * PATCH /api/lp/transactions/[id]/approve
 * 批准交易申请
 *
 * Body:
 * {
 *   nav: number,        // 确认净值
 *   note: string        // 备注
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
        { error: 'Forbidden - Only admins can approve transactions' },
        { status: 403 }
      )
    }

    // 2. 解析请求体
    const body = await request.json()
    const { nav, note } = body

    if (!nav || nav <= 0) {
      return NextResponse.json(
        { error: 'Invalid NAV - Must be a positive number' },
        { status: 400 }
      )
    }

    // 3. 获取交易详情
    const supabase: any = await createServerClient()
    const { data: tx, error: txError } = await supabase
      .from('transactions')
      .select(`
        *,
        fund:funds(*)
      `)
      .eq('id', resolvedParams.id)
      .single()

    if (txError || !tx) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Validate transaction status
    const transaction = tx as any
    if (transaction.status !== 'pending') {
      return NextResponse.json(
        { error: 'Transaction is not pending' },
        { status: 400 }
      )
    }

    // 4. 计算份额或金额
    let finalShares: number
    let finalAmount: number

    if (transaction.type === 'subscribe') {
      // 申购：计算份额 = 金额 / 净值
      finalShares = transaction.amount / nav
      finalAmount = transaction.amount
    } else if (transaction.type === 'redeem') {
      // 赎回：计算金额 = 份额 * 净值
      finalShares = transaction.shares
      finalAmount = transaction.shares * nav
    } else {
      return NextResponse.json(
        { error: 'Invalid transaction type for approval' },
        { status: 400 }
      )
    }

    // 5. 更新交易记录
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: 'approved',
        nav,
        shares: finalShares,
        amount: finalAmount,
        notes: note || transaction.notes,
        processed_at: new Date().toISOString(),
      })
      .eq('id', resolvedParams.id)

    if (updateError) {
      console.error('Error updating transaction:', updateError)
      return NextResponse.json(
        { error: 'Failed to update transaction' },
        { status: 500 }
      )
    }

    // 6. 更新持仓
    if (transaction.type === 'subscribe') {
      // 申购：增加份额
      const { data: existingHolding, error: holdingError } = await supabase
        .from('holdings')
        .select('*')
        .eq('user_id', transaction.user_id)
        .eq('fund_id', transaction.fund_id)
        .single()

      if (holdingError && holdingError.code !== 'PGRST116') {
        console.error('Error fetching holding:', holdingError)
      }

      if (existingHolding) {
        // 更新现有持仓
        await supabase
          .from('holdings')
          .update({
            shares: existingHolding.shares + finalShares,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingHolding.id)
      } else {
        // 创建新持仓
        await supabase
          .from('holdings')
          .insert({
            user_id: transaction.user_id,
            fund_id: transaction.fund_id,
            shares: finalShares,
            nav_at_purchase: nav,
            total_value: finalAmount,
          })
      }
    } else if (transaction.type === 'redeem') {
      // 赎回：减少份额
      const { data: existingHolding, error: holdingError } = await supabase
        .from('holdings')
        .select('*')
        .eq('user_id', transaction.user_id)
        .eq('fund_id', transaction.fund_id)
        .single()

      if (existingHolding) {
        const newShares = existingHolding.shares - finalShares
        if (newShares <= 0) {
          // 删除持仓（份额为0）
          await supabase
            .from('holdings')
            .delete()
            .eq('id', existingHolding.id)
        } else {
          // 更新持仓
          await supabase
            .from('holdings')
            .update({
              shares: newShares,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingHolding.id)
        }
      }
    }

    // 7. 返回成功
    return NextResponse.json({
      success: true,
      message: 'Transaction approved successfully',
      data: {
        id: resolvedParams.id,
        status: 'approved',
        nav,
        shares: finalShares,
        amount: finalAmount
      }
    })

  } catch (error) {
    console.error('Transaction approve API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
