/**
 * GET/PATCH/DELETE /api/lp/documents/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { lpExecute, lpQueryOne } from '@/lib/lp-turso'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const doc: any = await lpQueryOne(
      `SELECT d.*, f.id as f_id, f.name as f_name FROM lp_documents d
       LEFT JOIN lp_funds f ON f.id = d.fund_id WHERE d.id = ?`, [id]
    )
    if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    const data = { ...doc, fund: doc.f_id ? { id: doc.f_id, name: doc.f_name } : null }
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
    if (body.category !== undefined) { setParts.push('category = ?'); args.push(body.category) }
    if (body.fund_id !== undefined) { setParts.push('fund_id = ?'); args.push(body.fund_id) }

    if (!setParts.length) return NextResponse.json({ error: 'No fields to update' }, { status: 400 })

    args.push(id)
    await lpExecute(`UPDATE lp_documents SET ${setParts.join(', ')} WHERE id = ?`, args)
    const data = await lpQueryOne(`SELECT * FROM lp_documents WHERE id = ?`, [id])
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

    await lpExecute(`DELETE FROM lp_documents WHERE id = ?`, [id])
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
