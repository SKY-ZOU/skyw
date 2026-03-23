/**
 * GET /api/lp/funds - 获取基金列表
 * POST /api/lp/funds - 创建新基金（管理员）
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { getFunds, getActiveFunds } from '@/lib/lp-db-helpers'
import { lpExecute, lpQueryOne, newId, now } from '@/lib/lp-turso'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const result = status === 'active' ? await getActiveFunds() : await getFunds()
    return NextResponse.json({ success: true, data: result.data || [] })
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
    const { name, description, currency, nav, status } = body

    if (!name || !currency || !nav) {
      return NextResponse.json({ error: 'Missing required fields: name, currency, nav' }, { status: 400 })
    }
    if (!['CNY', 'USD', 'HKD'].includes(currency)) {
      return NextResponse.json({ error: 'Invalid currency' }, { status: 400 })
    }
    if (nav <= 0) return NextResponse.json({ error: 'NAV must be positive' }, { status: 400 })

    const id = newId()
    await lpExecute(
      `INSERT INTO lp_funds (id, name, description, currency, nav, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, name, description ?? null, currency, nav, status || 'active', now()]
    )
    const data = await lpQueryOne(`SELECT * FROM lp_funds WHERE id = ?`, [id])
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
