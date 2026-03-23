/**
 * GET /api/lp/transactions/[id] - 获取交易详情
 * PATCH /api/lp/transactions/[id] - 更新交易状态
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { updateTransactionStatus } from '@/lib/lp-db-helpers'
import { lpQueryOne } from '@/lib/lp-turso'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const transaction: any = await lpQueryOne(
      `SELECT t.*, u.id as u_id, u.name as u_name, u.email as u_email,
              f.id as f_id, f.name as f_name, f.currency as f_currency
       FROM lp_transactions t
       JOIN lp_users u ON u.id = t.user_id
       JOIN lp_funds f ON f.id = t.fund_id
       WHERE t.id = ?`, [id]
    )

    if (!transaction) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })

    const isAdmin = session.user.role === 'admin' || session.user.role === 'fund_manager'
    if (!isAdmin && transaction.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = {
      id: transaction.id, user_id: transaction.user_id, fund_id: transaction.fund_id,
      type: transaction.type, amount: transaction.amount, shares: transaction.shares,
      status: transaction.status, notes: transaction.notes,
      created_at: transaction.created_at, updated_at: transaction.updated_at,
      user: { id: transaction.u_id, name: transaction.u_name, email: transaction.u_email },
      fund: { id: transaction.f_id, name: transaction.f_name, currency: transaction.f_currency },
    }
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'admin' && session.user.role !== 'fund_manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { status } = body
    if (!status || !['approved', 'rejected', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const { data, error } = await updateTransactionStatus(id, status, session.user.id)
    if (error) return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 })
    return NextResponse.json({ success: true, message: `Transaction ${status}`, data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
