/**
 * GET/PATCH /api/lp/funds/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { getFundById } from '@/lib/lp-db-helpers'
import { lpExecute, lpQueryOne } from '@/lib/lp-turso'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data } = await getFundById(id)
    if (!data) return NextResponse.json({ error: 'Fund not found' }, { status: 404 })
    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'admin' && session.user.role !== 'fund_manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const setParts: string[] = []
    const args: unknown[] = []

    if (body.name !== undefined) { setParts.push('name = ?'); args.push(body.name) }
    if (body.description !== undefined) { setParts.push('description = ?'); args.push(body.description) }
    if (body.status !== undefined) {
      if (!['active', 'closed'].includes(body.status))
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      setParts.push('status = ?'); args.push(body.status)
    }
    if (body.nav !== undefined) {
      if (body.nav <= 0) return NextResponse.json({ error: 'NAV must be positive' }, { status: 400 })
      setParts.push('nav = ?'); args.push(body.nav)
    }

    if (!setParts.length) return NextResponse.json({ error: 'No fields to update' }, { status: 400 })

    args.push(id)
    await lpExecute(`UPDATE lp_funds SET ${setParts.join(', ')} WHERE id = ?`, args)
    const data = await lpQueryOne(`SELECT * FROM lp_funds WHERE id = ?`, [id])
    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
