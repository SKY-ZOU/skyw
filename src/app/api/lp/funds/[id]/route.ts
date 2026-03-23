/**
 * 天汇基金 LP Portal - 单个基金 API
 *
 * GET /api/lp/funds/[id] - 获取基金详情
 * PATCH /api/lp/funds/[id] - 更新基金信息（管理员）
 *
 * 权限:
 * - GET: 所有登录用户
 * - PATCH: 仅 Admin/Fund Manager
 *
 * @module app/api/lp/funds/[id]/route
 * @created 2026-02-18
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { getFundById } from '@/lib/lp-db-helpers'
import { createServerClient } from '@/lib/lp-supabase'

/**
 * GET /api/lp/funds/[id]
 * 获取基金详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15)
    const resolvedParams = await params
    // 1. 验证登录
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    // 2. 查询基金
    const { data: fund, error } = await getFundById(resolvedParams.id)

    if (error || !fund) {
      return NextResponse.json(
        { error: 'Fund not found' },
        { status: 404 }
      )
    }

    // 3. 返回结果
    return NextResponse.json({
      success: true,
      data: fund
    })

  } catch (error) {
    console.error('Fund GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/lp/funds/[id]
 * 更新基金信息
 *
 * Body: (所有字段可选)
 * {
 *   name?: string,
 *   description?: string,
 *   nav?: number,
 *   status?: 'active' | 'closed'
 * }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15)
    const resolvedParams = await params
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
        { error: 'Forbidden - Only admins can update funds' },
        { status: 403 }
      )
    }

    // 3. 解析请求体
    const body = await request.json()
    const updates: Record<string, any> = {}

    // 4. 验证和准备更新数据
    if (body.name !== undefined) updates.name = body.name
    if (body.description !== undefined) updates.description = body.description
    if (body.status !== undefined) {
      if (!['active', 'closed'].includes(body.status)) {
        return NextResponse.json(
          { error: 'Invalid status. Must be "active" or "closed"' },
          { status: 400 }
        )
      }
      updates.status = body.status
    }
    if (body.nav !== undefined) {
      if (body.nav <= 0) {
        return NextResponse.json(
          { error: 'NAV must be a positive number' },
          { status: 400 }
        )
      }
      updates.nav = body.nav
    }

    // 5. 至少要有一个字段更新
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    // 6. 更新基金
    const supabase: any = await createServerClient()
    const { data, error } = await supabase
      .from('funds')
      .update(updates)
      .eq('id', resolvedParams.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating fund:', error)
      return NextResponse.json(
        { error: 'Failed to update fund' },
        { status: 500 }
      )
    }

    // 7. 返回结果
    return NextResponse.json({
      success: true,
      message: 'Fund updated successfully',
      data
    })

  } catch (error) {
    console.error('Fund PATCH API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
