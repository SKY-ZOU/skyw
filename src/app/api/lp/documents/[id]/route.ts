/**
 * 天汇基金 LP Portal - 单个文档 API
 *
 * GET /api/lp/documents/[id] - 获取文档详情
 * PATCH /api/lp/documents/[id] - 更新文档元数据（管理员）
 * DELETE /api/lp/documents/[id] - 删除文档（管理员）
 *
 * 权限:
 * - GET: 所有登录用户
 * - PATCH/DELETE: 仅 Admin/Fund Manager
 *
 * @module app/api/lp/documents/[id]/route
 * @created 2026-02-18
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { createServerClient, createAdminClient } from '@/lib/lp-supabase'

/**
 * GET /api/lp/documents/[id]
 * 获取文档详情
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

    // 2. 查询文档
    const supabase = await createServerClient()
    const { data: document, error } = await supabase
      .from('documents')
      .select(`
        *,
        fund:funds(id, name)
      `)
      .eq('id', resolvedParams.id)
      .single()

    if (error || !document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // 3. 返回结果
    return NextResponse.json({
      success: true,
      data: document
    })

  } catch (error) {
    console.error('Document GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/lp/documents/[id]
 * 更新文档元数据
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
        { error: 'Forbidden - Only admins can update documents' },
        { status: 403 }
      )
    }

    // 3. 解析请求体
    const body = await request.json()
    const { title, category, fund_id } = body

    // 4. 数据验证
    if (!title && !category && fund_id === undefined) {
      return NextResponse.json(
        { error: 'At least one field must be provided: title, category, or fund_id' },
        { status: 400 }
      )
    }

    if (category) {
      const validCategories = ['quarterly_report', 'monthly_report', 'agreement', 'notice', 'other']
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
          { status: 400 }
        )
      }
    }

    // 5. 构建更新数据
    const updates: Record<string, unknown> = {}
    if (title) updates.title = title
    if (category) updates.category = category
    if (fund_id !== undefined) updates.fund_id = fund_id

    // 6. 更新文档
    const supabase = await createServerClient()
    // @ts-ignore - Type issue with Supabase generated types
    const { data: document, error } = await (supabase
      .from('documents') as any)
      .update(updates)
      .eq('id', resolvedParams.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating document:', error)
      return NextResponse.json(
        { error: 'Failed to update document' },
        { status: 500 }
      )
    }

    // 7. 返回结果
    return NextResponse.json({
      success: true,
      message: 'Document updated successfully',
      data: document
    })

  } catch (error) {
    console.error('Document PATCH API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/lp/documents/[id]
 * 删除文档（同时删除 Storage 中的文件）
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
        { error: 'Forbidden - Only admins can delete documents' },
        { status: 403 }
      )
    }

    // 3. 先获取文档信息
    const supabase = await createServerClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: { data: any; error: any } = await supabase
      .from('documents')
      .select('file_url')
      .eq('id', resolvedParams.id)
      .single()

    const document = result.data
    const fetchError = result.error

    if (fetchError || !document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // 4. 删除 Storage 中的文件
    const supabaseAdmin = createAdminClient()
    try {
      // 从 URL 中提取文件路径
      const urlParts = document.file_url.split('/')
      const fileName = urlParts[urlParts.length - 1]

      // 如果是 Supabase Storage URL，尝试删除
      if (document.file_url.includes('supabase')) {
        // 提取 bucket 后的路径
        const storagePath = document.file_url.split('documents/')[1]
        if (storagePath) {
          await supabaseAdmin.storage
            .from('documents')
            .remove([storagePath])
        }
      }
    } catch (storageError) {
      console.warn('Failed to delete storage file:', storageError)
      // 继续删除数据库记录
    }

    // 5. 删除数据库记录
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', resolvedParams.id)

    if (deleteError) {
      console.error('Error deleting document:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete document' },
        { status: 500 }
      )
    }

    // 6. 返回结果
    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    })

  } catch (error) {
    console.error('Document DELETE API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
