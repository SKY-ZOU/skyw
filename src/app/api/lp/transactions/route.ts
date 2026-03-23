/**
 * 天汇基金 LP Portal - 交易 API
 *
 * GET /api/lp/transactions - 获取交易记录列表
 * POST /api/lp/transactions - 创建新交易（认购/赎回）
 *
 * 权限:
 * - GET: LP 看自己的，Admin/Fund Manager 看全部
 * - POST: LP 可创建自己的交易
 *
 * @module app/api/lp/transactions/route
 * @created 2026-02-18
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { getUserTransactions, getPendingTransactions, createTransaction } from '@/lib/lp-db-helpers'

/**
 * GET /api/lp/transactions
 * 获取交易记录列表
 *
 * Query params:
 * - user_id: 指定用户ID（仅管理员）
 * - status: 交易状态筛选 (pending|approved|rejected|completed)
 * - limit: 返回数量限制
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
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    // 3. 权限检查和数据查询
    let result

    if (status === 'pending' && (session.user.role === 'admin' || session.user.role === 'fund_manager')) {
      // 管理员查询待审批交易
      result = await getPendingTransactions()
    } else if (targetUserId) {
      // 管理员查询指定用户的交易
      if (session.user.role !== 'admin' && session.user.role !== 'fund_manager') {
        return NextResponse.json(
          { error: 'Forbidden - Insufficient permissions' },
          { status: 403 }
        )
      }
      result = await getUserTransactions(targetUserId, limit)
    } else {
      // LP 查询自己的交易
      result = await getUserTransactions(session.user.id, limit)
    }

    const { data, error } = result

    if (error) {
      console.error('Error fetching transactions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch transactions' },
        { status: 500 }
      )
    }

    // 4. 返回结果
    return NextResponse.json({
      success: true,
      data: data || []
    })

  } catch (error) {
    console.error('Transactions GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/lp/transactions
 * 创建新交易
 *
 * Body:
 * {
 *   fund_id: string,
 *   type: 'subscribe' | 'redeem',
 *   amount: number | null,
 *   shares: number | null,
 *   note: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 验证登录
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    // 2. 解析请求体
    const body = await request.json()
    const { fund_id, type, amount, shares, note } = body

    // 3. 数据验证
    if (!fund_id || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: fund_id, type' },
        { status: 400 }
      )
    }

    if (!['subscribe', 'redeem'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "subscribe" or "redeem"' },
        { status: 400 }
      )
    }

    // 验证金额/份额
    if (type === 'subscribe') {
      if (!amount || amount < 1000000) {
        return NextResponse.json(
          { error: '最低申购金额为 HK$1,000,000' },
          { status: 400 }
        )
      }
    } else if (type === 'redeem') {
      if (!shares || shares <= 0) {
        return NextResponse.json(
          { error: '赎回份额必须大于0' },
          { status: 400 }
        )
      }
    }

    // 4. 创建交易
    const { data, error } = await createTransaction(
      session.user.id,
      fund_id,
      type,
      type === 'subscribe' ? amount : shares,
      type === 'subscribe' ? amount : shares,
      note
    )

    if (error) {
      console.error('Error creating transaction:', error)
      return NextResponse.json(
        { error: 'Failed to create transaction' },
        { status: 500 }
      )
    }

    // 5. 返回结果
    return NextResponse.json({
      success: true,
      message: 'Transaction created successfully',
      data
    }, { status: 201 })

  } catch (error) {
    console.error('Transactions POST API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
