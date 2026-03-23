/**
 * GET /api/lp/nav-history
 * 查询基金净值历史
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { lpQuery } from '@/lib/lp-turso'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const fundId = searchParams.get('fund_id')
    const limit = parseInt(searchParams.get('limit') || '24', 10)
    const mode = searchParams.get('mode')

    if (mode === 'comparison') {
      const funds = await lpQuery<{ id: string; name: string }>(
        `SELECT id, name FROM lp_funds WHERE status = 'active'`
      )

      const results = await Promise.all(
        funds.map(async (fund) => {
          const history = await lpQuery<{ date: string; nav: number }>(
            `SELECT date, nav FROM lp_nav_history WHERE fund_id = ? ORDER BY date DESC LIMIT 400`,
            [fund.id]
          )
          if (!history.length) {
            return { id: fund.id, name: fund.name, return_1m: 0, return_3m: 0, return_6m: 0, return_1y: 0 }
          }
          const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date))
          const latest = sorted[0]

          const calcReturn = (daysAgo: number) => {
            const targetDate = new Date(latest.date)
            targetDate.setDate(targetDate.getDate() - daysAgo)
            const targetStr = targetDate.toISOString().split('T')[0]
            const ref = sorted.find(h => h.date <= targetStr)
            if (!ref) return 0
            return ((Number(latest.nav) - Number(ref.nav)) / Number(ref.nav)) * 100
          }

          return {
            id: fund.id, name: fund.name,
            return_1m: parseFloat(calcReturn(30).toFixed(2)),
            return_3m: parseFloat(calcReturn(90).toFixed(2)),
            return_6m: parseFloat(calcReturn(180).toFixed(2)),
            return_1y: parseFloat(calcReturn(365).toFixed(2)),
          }
        })
      )
      return NextResponse.json({ success: true, data: results })
    }

    if (!fundId) return NextResponse.json({ error: 'fund_id 为必填项' }, { status: 400 })

    const history = await lpQuery<{ date: string; nav: number }>(
      `SELECT date, nav FROM lp_nav_history WHERE fund_id = ? ORDER BY date ASC LIMIT ?`,
      [fundId, limit]
    )

    const enriched = history.map((item, idx) => {
      const base = Number(history[0]?.nav ?? item.nav)
      return {
        date: item.date,
        nav: Number(item.nav),
        return_pct: parseFloat(((Number(item.nav) - base) / base * 100).toFixed(2))
      }
    })

    return NextResponse.json({ success: true, data: enriched })
  } catch (error) {
    console.error('nav-history error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
