/**
 * POST /api/lp/transactions/[id]/cancel
 * LP 用户撤销自己的待审批交易
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { lpQueryOne, lpExecute } from '@/lib/lp-turso'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const tx: any = await lpQueryOne(`SELECT * FROM lp_transactions WHERE id = ?`, [id])
    if (!tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    if (tx.user_id !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (tx.status !== 'pending') return NextResponse.json({ error: 'Only pending transactions can be cancelled' }, { status: 400 })

    await lpExecute(`DELETE FROM lp_transactions WHERE id = ?`, [id])
    return NextResponse.json({ success: true, message: 'Transaction cancelled' })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
