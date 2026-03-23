/**
 * 天汇基金 LP Portal - 公告 API
 *
 * GET /api/lp/announcements - 获取公告列表
 * POST /api/lp/announcements - 发布新公告（管理员）
 *
 * 权限:
 * - GET: 所有登录用户
 * - POST: 仅 Admin/Fund Manager
 *
 * @module app/api/lp/announcements/route
 * @created 2026-02-18
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { getAnnouncements } from '@/lib/lp-db-helpers'
import { createServerClient } from '@/lib/lp-supabase'

/**
 * GET /api/lp/announcements
 * 获取公告列表
 *
 * Query params:
 * - limit: 返回数量限制 (default: 10)
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
    const limit = parseInt(searchParams.get('limit') || '10')

    // 3. 查询数据
    const { data, error } = await getAnnouncements(limit)

    if (error) {
      console.error('Error fetching announcements:', error)
      return NextResponse.json(
        { error: 'Failed to fetch announcements' },
        { status: 500 }
      )
    }

    // 4. 返回结果
    return NextResponse.json({
      success: true,
      data: data || []
    })

  } catch (error) {
    console.error('Announcements GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/lp/announcements
 * 发布新公告
 *
 * Body:
 * {
 *   title: string,
 *   content: string,
 *   type: 'important' | 'normal'
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
        { error: 'Forbidden - Only admins can publish announcements' },
        { status: 403 }
      )
    }

    // 3. 解析请求体
    const body = await request.json()
    const { title, content, type } = body

    // 4. 数据验证
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content' },
        { status: 400 }
      )
    }

    if (type && !['important', 'normal'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "important" or "normal"' },
        { status: 400 }
      )
    }

    // 5. 创建公告
    const supabase: any = await createServerClient()
    const { data, error } = await supabase
      .from('announcements')
      .insert({
        title,
        content,
        type: type || 'normal',
        published_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating announcement:', error)
      return NextResponse.json(
        { error: 'Failed to create announcement' },
        { status: 500 }
      )
    }

    // 6. 返回结果
    return NextResponse.json({
      success: true,
      message: 'Announcement published successfully',
      data
    }, { status: 201 })

  } catch (error) {
    console.error('Announcements POST API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
