/**
 * GET /api/lp/announcements - 获取公告列表
 * POST /api/lp/announcements - 发布新公告（管理员）
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { getAnnouncements } from '@/lib/lp-db-helpers'
import { lpExecute, lpQueryOne, newId, now } from '@/lib/lp-turso'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const { data } = await getAnnouncements(limit)
    return NextResponse.json({ success: true, data: data || [] })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'admin' && session.user.role !== 'fund_manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, priority } = body
    if (!title || !content) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    const id = newId()
    const ts = now()
    await lpExecute(
      `INSERT INTO lp_announcements (id, title, content, priority, published_by, published_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, title, content, priority || 'normal', session.user.id, ts, ts]
    )
    const data = await lpQueryOne(`SELECT * FROM lp_announcements WHERE id = ?`, [id])
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
