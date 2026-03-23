/**
 * PATCH /api/lp/transactions/[id]/approve
 * 管理员批准交易，更新持仓
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { lpQueryOne, lpExecute, newId, now } from '@/lib/lp-turso'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'admin' && session.user.role !== 'fund_manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { nav, note } = body
    if (!nav || nav <= 0) return NextResponse.json({ error: 'Invalid NAV' }, { status: 400 })

    const tx: any = await lpQueryOne(`SELECT * FROM lp_transactions WHERE id = ?`, [id])
    if (!tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    if (tx.status !== 'pending') return NextResponse.json({ error: 'Not pending' }, { status: 400 })

    let finalShares: number, finalAmount: number
    if (tx.type === 'subscribe') {
      finalShares = Number(tx.amount) / nav
      finalAmount = Number(tx.amount)
    } else if (tx.type === 'redeem') {
      finalShares = Number(tx.shares)
      finalAmount = Number(tx.shares) * nav
    } else {
      return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 })
    }

    // Update transaction
    await lpExecute(
      `UPDATE lp_transactions SET status='approved', shares=?, amount=?, notes=?, reviewed_by=?, reviewed_at=?, updated_at=? WHERE id=?`,
      [finalShares, finalAmount, note || tx.notes, session.user.id, now(), now(), id]
    )

    // Update holdings
    const holding: any = await lpQueryOne(
      `SELECT * FROM lp_holdings WHERE user_id=? AND fund_id=?`, [tx.user_id, tx.fund_id]
    )

    if (tx.type === 'subscribe') {
      if (holding) {
        await lpExecute(
          `UPDATE lp_holdings SET shares=?, cost_basis=? WHERE id=?`,
          [Number(holding.shares) + finalShares, nav, holding.id]
        )
      } else {
        await lpExecute(
          `INSERT INTO lp_holdings (id, user_id, fund_id, shares, cost_basis, created_at) VALUES (?,?,?,?,?,?)`,
          [newId(), tx.user_id, tx.fund_id, finalShares, nav, now()]
        )
      }
    } else if (tx.type === 'redeem' && holding) {
      const newShares = Number(holding.shares) - finalShares
      if (newShares <= 0) {
        await lpExecute(`DELETE FROM lp_holdings WHERE id=?`, [holding.id])
      } else {
        await lpExecute(`UPDATE lp_holdings SET shares=? WHERE id=?`, [newShares, holding.id])
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction approved',
      data: { id, status: 'approved', nav, shares: finalShares, amount: finalAmount }
    })
  } catch (error) {
    console.error('approve error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
