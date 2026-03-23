/**
 * POST /api/lp/seed - LP Portal 初始化（Turso 版）
 * Body: { "secret": "<LP_SEED_SECRET>" }
 */

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { lpQuery, lpExecute, newId } from '@/lib/lp-turso'

const SEED_SECRET = process.env.LP_SEED_SECRET

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!SEED_SECRET || body.secret !== SEED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminHash = await bcrypt.hash('admin123', 10)
    const lpHash = await bcrypt.hash('lp123456', 10)
    const ts = new Date().toISOString()

    const usersToSeed = [
      { email: 'admin@skyw.group', hash: adminHash, role: 'admin', name: '系统管理员' },
      { email: 'lp1@skyw.group', hash: lpHash, role: 'lp', name: '张投资人' },
      { email: 'lp2@skyw.group', hash: lpHash, role: 'lp', name: '李投资人' },
    ]

    const existing = await lpQuery<{ email: string }>(`SELECT email FROM lp_users`)
    const existingEmails = existing.map(u => u.email)

    const created: string[] = []
    const skipped: string[] = []

    for (const u of usersToSeed) {
      if (existingEmails.includes(u.email)) {
        skipped.push(u.email)
      } else {
        await lpExecute(
          `INSERT INTO lp_users (id, email, password_hash, role, name, created_at) VALUES (?,?,?,?,?,?)`,
          [newId(), u.email, u.hash, u.role, u.name, ts]
        )
        created.push(u.email)
      }
    }

    // Seed funds if empty
    const funds = await lpQuery(`SELECT id FROM lp_funds`)
    let fundsSeeded = false
    if (!funds.length) {
      const fundData = [
        ['10000000-0000-0000-0000-000000000001', '天汇成长一期基金', 'CNY', 1.2580],
        ['10000000-0000-0000-0000-000000000002', '天汇稳健二期基金', 'CNY', 1.1025],
        ['10000000-0000-0000-0000-000000000003', '天汇全球配置基金', 'USD', 1.0568],
        ['10000000-0000-0000-0000-000000000004', '天汇科技创新基金', 'CNY', 1.3892],
      ]
      for (const [id, name, currency, nav] of fundData) {
        await lpExecute(
          `INSERT INTO lp_funds (id, name, currency, nav, status, created_at) VALUES (?,?,?,?,'active',?)`,
          [id, name, currency, nav, ts]
        )
      }
      fundsSeeded = true
    }

    // Seed announcements if empty
    const ann = await lpQuery(`SELECT id FROM lp_announcements`)
    if (!ann.length) {
      await lpExecute(
        `INSERT INTO lp_announcements (id, title, content, priority, created_at) VALUES (?,?,?,?,?)`,
        [newId(), '系统上线公告', '天汇基金 LP Portal 正式上线，欢迎使用我们的全新服务平台。', 'high', ts]
      )
    }

    return NextResponse.json({
      ok: true,
      users: { created, skipped },
      fundsSeeded,
      accounts: [
        { email: 'admin@skyw.group', password: 'admin123', role: 'admin' },
        { email: 'lp1@skyw.group', password: 'lp123456', role: 'lp' },
        { email: 'lp2@skyw.group', password: 'lp123456', role: 'lp' },
      ],
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
