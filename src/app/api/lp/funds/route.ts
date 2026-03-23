/**
 * 天汇基金 LP Portal - 基金 API
 *
 * GET /api/lp/funds - 获取基金列表
 * POST /api/lp/funds - 创建新基金（管理员）
 *
 * 权限:
 * - GET: 所有登录用户
 * - POST: 仅 Admin/Fund Manager
 *
 * @module app/api/lp/funds/route
 * @created 2026-02-18
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { getFunds, getActiveFunds } from '@/lib/lp-db-helpers'
import { createAdminClient } from '@/lib/lp-supabase'

/**
 * GET /api/lp/funds
 * 获取基金列表
 *
 * Query params:
 * - status: active | closed | all (default: all)
 */
export async function GET(request: NextRequest) {
  try {
    // 1. 验证登录
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    // 2. 获取查询参数
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // 3. 查询数据
    let result
    if (status === 'active') {
      result = await getActiveFunds()
    } else {
      result = await getFunds()
    }

    const { data, error } = result

    if (error) {
      console.error('Error fetching funds:', error)
      return NextResponse.json(
        { error: 'Failed to fetch funds' },
        { status: 500 }
      )
    }

    // 4. 返回结果
    return NextResponse.json({
      success: true,
      data: data || []
    })

  } catch (error) {
    console.error('Funds GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/lp/funds
 * 创建新基金（管理员）
 *
 * Body:
 * {
 *   name: string,
 *   code: string,
 *   description?: string,
 *   currency: 'CNY' | 'USD' | 'HKD',
 *   nav: number,
 *   status: 'active' | 'closed'
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 验证登录
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    // 2. 权限检查
    if (session.user.role !== 'admin' && session.user.role !== 'fund_manager') {
      return NextResponse.json(
        { error: 'Forbidden - Only admins can create funds' },
        { status: 403 }
      )
    }

    // 3. 解析请求体
    const body = await request.json()
    const { name, code, description, currency, nav, status } = body

    // 4. 数据验证
    if (!name || !code || !currency || !nav) {
      return NextResponse.json(
        { error: 'Missing required fields: name, code, currency, nav' },
        { status: 400 }
      )
    }

    if (!['CNY', 'USD', 'HKD'].includes(currency)) {
      return NextResponse.json(
        { error: 'Invalid currency. Must be CNY, USD, or HKD' },
        { status: 400 }
      )
    }

    if (nav <= 0) {
      return NextResponse.json(
        { error: 'NAV must be a positive number' },
        { status: 400 }
      )
    }

    // 5. 创建基金
    const supabase: any = createAdminClient()
    const { data, error } = await supabase
      .from('funds')
      .insert({
        name,
        code,
        description,
        currency,
        nav,
        status: status || 'active'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating fund:', error)
      return NextResponse.json(
        { error: 'Failed to create fund' },
        { status: 500 }
      )
    }

    // 6. 返回结果
    return NextResponse.json({
      success: true,
      message: 'Fund created successfully',
      data
    }, { status: 201 })

  } catch (error) {
    console.error('Funds POST API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
