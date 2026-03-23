/**
 * LP Portal 数据库初始化接口
 * 用于首次部署后创建测试账号和基础数据
 *
 * 调用方式：POST /api/lp/seed
 * Body: { "secret": "<LP_SEED_SECRET>" }
 *
 * ⚠️ 生产环境使用后应删除或通过环境变量禁用此接口
 */

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createAdminClient } from '@/lib/lp-supabase'

const SEED_SECRET = process.env.LP_SEED_SECRET

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!SEED_SECRET || body.secret !== SEED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()

    // Check existing users
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('email')

    if (checkError) {
      return NextResponse.json({
        error: `Cannot check users table: ${checkError.message}`,
        hint: 'Run schema migration first in Supabase SQL editor'
      }, { status: 500 })
    }

    const existingEmails = (existingUsers || []).map((u: any) => u.email)

    // Generate password hashes
    const adminHash = await bcrypt.hash('admin123', 10)
    const lpHash = await bcrypt.hash('lp123456', 10)

    const usersToInsert = [
      { email: 'admin@skyw.group', password_hash: adminHash, role: 'admin', name: '系统管理员', phone: '+852 6819 9909' },
      { email: 'lp1@skyw.group', password_hash: lpHash, role: 'lp', name: '张投资人', phone: '+852 9123 4567' },
      { email: 'lp2@skyw.group', password_hash: lpHash, role: 'lp', name: '李投资人', phone: '+852 9876 5432' },
    ].filter(u => !existingEmails.includes(u.email))

    const results: { created: string[]; skipped: string[]; errors: string[] } = {
      created: [],
      skipped: existingEmails.filter((e: string) => ['admin@skyw.group', 'lp1@skyw.group', 'lp2@skyw.group'].includes(e)),
      errors: [],
    }

    for (const user of usersToInsert) {
      const { error } = await supabase.from('users').insert(user)
      if (error) {
        results.errors.push(`${user.email}: ${error.message}`)
      } else {
        results.created.push(user.email)
      }
    }

    // Seed basic fund data if funds table is empty
    const { data: existingFunds } = await supabase.from('funds').select('id').limit(1)
    let fundsSeeded = false

    if (!existingFunds || existingFunds.length === 0) {
      const { error: fundError } = await supabase.from('funds').insert([
        { id: '10000000-0000-0000-0000-000000000001', name: '天汇成长一期基金', currency: 'CNY', nav: 1.2580, status: 'active' },
        { id: '10000000-0000-0000-0000-000000000002', name: '天汇稳健二期基金', currency: 'CNY', nav: 1.1025, status: 'active' },
        { id: '10000000-0000-0000-0000-000000000003', name: '天汇全球配置基金', currency: 'USD', nav: 1.0568, status: 'active' },
        { id: '10000000-0000-0000-0000-000000000004', name: '天汇科技创新基金', currency: 'CNY', nav: 1.3892, status: 'active' },
      ])
      fundsSeeded = !fundError
      if (fundError) results.errors.push(`Funds: ${fundError.message}`)
    }

    return NextResponse.json({
      ok: true,
      users: results,
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
