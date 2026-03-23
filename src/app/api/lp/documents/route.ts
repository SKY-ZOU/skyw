/**
 * 天汇基金 LP Portal - 文档 API
 *
 * GET /api/lp/documents - 获取文档列表
 * POST /api/lp/documents - 上传新文档（管理员）
 *
 * 权限:
 * - GET: 所有登录用户
 * - POST: 仅 Admin/Fund Manager
 *
 * @module app/api/lp/documents/route
 * @created 2026-02-18
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { getDocuments, getDocumentsByCategory } from '@/lib/lp-db-helpers'
import { createAdminClient } from '@/lib/lp-supabase'

/**
 * GET /api/lp/documents
 * 获取文档列表
 *
 * Query params:
 * - category: 文档分类筛选
 * - fund_id: 基金ID筛选
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
    const category = searchParams.get('category')
    const fundId = searchParams.get('fund_id')

    // 3. 查询数据
    let result
    if (category) {
      result = await getDocumentsByCategory(category)
    } else {
      result = await getDocuments(fundId || undefined)
    }

    const { data, error } = result

    if (error) {
      console.error('Error fetching documents:', error)
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      )
    }

    // 4. 返回结果
    return NextResponse.json({
      success: true,
      data: data || []
    })

  } catch (error) {
    console.error('Documents GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/lp/documents
 * 上传新文档（包含文件上传到 Supabase Storage）
 *
 * FormData:
 * - title: string
 * - category: string
 * - fund_id?: string
 * - file: File
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
        { error: 'Forbidden - Only admins can upload documents' },
        { status: 403 }
      )
    }

    // 3. 解析 FormData
    const formData = await request.formData()
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const fundId = formData.get('fund_id') as string | null
    const file = formData.get('file') as File

    // 4. 数据验证
    if (!title || !category || !file) {
      return NextResponse.json(
        { error: 'Missing required fields: title, category, file' },
        { status: 400 }
      )
    }

    const validCategories = ['quarterly_report', 'monthly_report', 'agreement', 'notice', 'other']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      )
    }

    // 验证文件类型
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: PDF, DOC, DOCX, XLS, XLSX' },
        { status: 400 }
      )
    }

    // 验证文件大小 (10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // 5. 上传文件到 Supabase Storage
    const supabaseAdmin = createAdminClient()

    // 生成唯一文件名
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `documents/${timestamp}-${sanitizedFileName}`

    // 将 File 转换为 ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('documents')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file to storage' },
        { status: 500 }
      )
    }

    // 6. 获取公开访问 URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('documents')
      .getPublicUrl(filePath)

    // 7. 创建文档记录（使用 admin client 绕过 RLS）
    const supabaseDb = createAdminClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: document, error: dbError } = await (supabaseDb
      .from('documents') as any)
      .insert({
        title,
        category,
        fund_id: fundId || null,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)

      // 回滚：删除已上传的文件
      await supabaseAdmin.storage.from('documents').remove([filePath])

      return NextResponse.json(
        { error: 'Failed to create document record' },
        { status: 500 }
      )
    }

    // 8. 返回结果
    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully',
      data: document
    }, { status: 201 })

  } catch (error) {
    console.error('Documents POST API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
