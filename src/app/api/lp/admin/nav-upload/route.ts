/**
 * POST /api/lp/admin/nav-upload
 * 管理员上传净值 CSV 文件
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { lpBatch, lpExecute, newId, now } from '@/lib/lp-turso'

interface CsvRow { date: string; nav: string }

function parseCSV(text: string): CsvRow[] {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length < 2) return []
  const header = lines[0].toLowerCase().split(',').map(h => h.trim())
  const dateIdx = header.indexOf('date')
  const navIdx = header.indexOf('nav')
  if (dateIdx === -1 || navIdx === -1) throw new Error('CSV 必须包含 date 和 nav 两列')
  return lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim())
    return { date: cols[dateIdx], nav: cols[navIdx] }
  }).filter(row => row.date && row.nav)
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'admin' && session.user.role !== 'fund_manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const fundId = formData.get('fund_id') as string
    const file = formData.get('file') as File

    if (!fundId || !file) return NextResponse.json({ error: 'fund_id 和 file 为必填项' }, { status: 400 })

    const text = await file.text()
    let rows: CsvRow[]
    try { rows = parseCSV(text) } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 })
    }
    if (!rows.length) return NextResponse.json({ error: 'CSV 无有效数据' }, { status: 400 })

    for (const row of rows) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date))
        return NextResponse.json({ error: `无效日期: ${row.date}` }, { status: 400 })
      if (isNaN(parseFloat(row.nav)) || parseFloat(row.nav) <= 0)
        return NextResponse.json({ error: `无效净值: ${row.nav}` }, { status: 400 })
    }

    // Upsert nav_history (INSERT OR REPLACE handles ON CONFLICT)
    const statements = rows.map(row => ({
      sql: `INSERT OR REPLACE INTO lp_nav_history (id, fund_id, date, nav, created_at)
            VALUES (COALESCE((SELECT id FROM lp_nav_history WHERE fund_id=? AND date=?), ?), ?, ?, ?, ?)`,
      args: [fundId, row.date, newId(), fundId, row.date, parseFloat(row.nav), now()]
    }))
    await lpBatch(statements)

    const sorted = [...rows].sort((a, b) => b.date.localeCompare(a.date))
    const latestNav = parseFloat(sorted[0].nav)
    await lpExecute(`UPDATE lp_funds SET nav = ? WHERE id = ?`, [latestNav, fundId])

    return NextResponse.json({
      success: true,
      message: `成功导入 ${rows.length} 条净值记录`,
      latest_nav: latestNav,
      date_range: { from: sorted[sorted.length - 1].date, to: sorted[0].date }
    })
  } catch (error) {
    console.error('nav-upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
