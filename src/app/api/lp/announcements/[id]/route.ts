/**
 * 天汇基金 LP Portal - 单个公告 API
 *
 * GET /api/lp/announcements/[id] - 获取公告详情
 * PATCH /api/lp/announcements/[id] - 更新公告（管理员）
 * DELETE /api/lp/announcements/[id] - 删除公告（管理员）
 *
 * 权限:
 * - GET: 所有登录用户
 * - PATCH/DELETE: 仅 Admin/Fund Manager
 *
 * @module app/api/lp/announcements/[id]/route
 * @created 2026-02-18
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { getAnnouncementById } from '@/lib/lp-db-helpers'
import { createServerClient } from '@/lib/lp-supabase'

/**
 * GET /api/lp/announcements/[id]
 * 获取公告详情
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

    // 2. 查询公告
    const { data: announcement, error } = await getAnnouncementById(resolvedParams.id)

    if (error || !announcement) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      )
    }

    // 3. 返回结果
    return NextResponse.json({
      success: true,
      data: announcement
    })

  } catch (error) {
    console.error('Announcement GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/lp/announcements/[id]
 * 更新公告
 *
 * Body: (所有字段可选)
 * {
 *   title?: string,
 *   content?: string,
 *   type?: 'important' | 'normal'
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
        { error: 'Forbidden - Only admins can update announcements' },
        { status: 403 }
      )
    }

    // 3. 解析请求体
    const body = await request.json()
    const updates: Record<string, any> = {}

    // 4. 验证和准备更新数据
    if (body.title !== undefined) updates.title = body.title
    if (body.content !== undefined) updates.content = body.content
    if (body.type !== undefined) {
      if (!['important', 'normal'].includes(body.type)) {
        return NextResponse.json(
          { error: 'Invalid type. Must be "important" or "normal"' },
          { status: 400 }
        )
      }
      updates.type = body.type
    }

    // 5. 至少要有一个字段更新
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    // 6. 更新公告
    const supabase: any = await createServerClient()
    const { data, error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', resolvedParams.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating announcement:', error)
      return NextResponse.json(
        { error: 'Failed to update announcement' },
        { status: 500 }
      )
    }

    // 7. 返回结果
    return NextResponse.json({
      success: true,
      message: 'Announcement updated successfully',
      data
    })

  } catch (error) {
    console.error('Announcement PATCH API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/lp/announcements/[id]
 * 删除公告
 */
export async function DELETE(
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
        { error: 'Forbidden - Only admins can delete announcements' },
        { status: 403 }
      )
    }

    // 3. 删除公告
    const supabase = await createServerClient()
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', resolvedParams.id)

    if (error) {
      console.error('Error deleting announcement:', error)
      return NextResponse.json(
        { error: 'Failed to delete announcement' },
        { status: 500 }
      )
    }

    // 4. 返回结果
    return NextResponse.json({
      success: true,
      message: 'Announcement deleted successfully'
    })

  } catch (error) {
    console.error('Announcement DELETE API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
