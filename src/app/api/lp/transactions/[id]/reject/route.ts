/**
 * PATCH /api/lp/transactions/[id]/reject
 * 管理员拒绝交易
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { lpQueryOne, lpExecute, now } from '@/lib/lp-turso'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'admin' && session.user.role !== 'fund_manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { note } = body
    if (!note?.trim()) return NextResponse.json({ error: 'Note is required' }, { status: 400 })

    const tx: any = await lpQueryOne(`SELECT * FROM lp_transactions WHERE id = ?`, [id])
    if (!tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    if (tx.status !== 'pending') return NextResponse.json({ error: 'Not pending' }, { status: 400 })

    await lpExecute(
      `UPDATE lp_transactions SET status='rejected', notes=?, reviewed_by=?, reviewed_at=?, updated_at=? WHERE id=?`,
      [note, session.user.id, now(), now(), id]
    )

    return NextResponse.json({ success: true, message: 'Transaction rejected', data: { id, status: 'rejected', note } })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
