/**
 * GET /api/lp/documents - 获取文档列表
 * POST /api/lp/documents - 创建文档记录（管理员）
 *
 * 注：文件存储需外部 URL（不含 Supabase Storage）
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'
import { getDocuments, getDocumentsByCategory } from '@/lib/lp-db-helpers'
import { lpExecute, lpQueryOne, newId, now } from '@/lib/lp-turso'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const fundId = searchParams.get('fund_id')

    const result = category
      ? await getDocumentsByCategory(category)
      : await getDocuments(fundId || undefined)

    return NextResponse.json({ success: true, data: result.data || [] })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(lpAuthOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'admin' && session.user.role !== 'fund_manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 支持 JSON body（file_url 字段）
    let title: string, category: string, fundId: string | null, fileUrl: string, fileType: string, fileSize: number | null

    const contentType = request.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const body = await request.json()
      title = body.title
      category = body.category
      fundId = body.fund_id || null
      fileUrl = body.file_url
      fileType = body.file_type || 'application/pdf'
      fileSize = body.file_size || null
    } else {
      // FormData mode (file upload not supported without storage service - accept URL only)
      const formData = await request.formData()
      title = formData.get('title') as string
      category = formData.get('category') as string
      fundId = formData.get('fund_id') as string | null
      fileUrl = formData.get('file_url') as string
      fileType = (formData.get('file_type') as string) || 'application/pdf'
      fileSize = null
    }

    if (!title || !category || !fileUrl) {
      return NextResponse.json({ error: 'Missing required fields: title, category, file_url' }, { status: 400 })
    }

    const id = newId()
    await lpExecute(
      `INSERT INTO lp_documents (id, title, category, fund_id, file_url, file_type, file_size, uploaded_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, category, fundId, fileUrl, fileType, fileSize, session.user.id, now()]
    )

    const data = await lpQueryOne(
      `SELECT d.*, f.id as f_id, f.name as f_name FROM lp_documents d LEFT JOIN lp_funds f ON f.id = d.fund_id WHERE d.id = ?`,
      [id]
    )
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
