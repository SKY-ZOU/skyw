/**
 * GET/PATCH/DELETE /api/lp/announcements/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { getAnnouncementById } from '@/lib/lp-db-helpers'
import { lpExecute, lpQueryOne } from '@/lib/lp-turso'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await getAnnouncementById(id)
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
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

    if (body.title !== undefined) { setParts.push('title = ?'); args.push(body.title) }
    if (body.content !== undefined) { setParts.push('content = ?'); args.push(body.content) }
    if (body.priority !== undefined) { setParts.push('priority = ?'); args.push(body.priority) }

    if (!setParts.length) return NextResponse.json({ error: 'No fields to update' }, { status: 400 })

    args.push(id)
    await lpExecute(`UPDATE lp_announcements SET ${setParts.join(', ')} WHERE id = ?`, args)
    const data = await lpQueryOne(`SELECT * FROM lp_announcements WHERE id = ?`, [id])
    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'admin' && session.user.role !== 'fund_manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await lpExecute(`DELETE FROM lp_announcements WHERE id = ?`, [id])
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
