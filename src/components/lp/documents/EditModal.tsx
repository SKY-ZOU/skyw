'use client'

/**
 * 文档编辑模态框
 * 用于管理员编辑文档元数据
 *
 * @module components/lp/documents/EditModal
 * @created 2026-02-18
 */

import { useState, useEffect, FormEvent } from 'react'
import { X, FileText, Loader2 } from 'lucide-react'

interface Fund {
  id: string
  name: string
}

interface Document {
  id: string
  title: string
  category: string
  fund_id: string | null
  file_url: string
  file_type: string
  file_size: number
  created_at: string
  fund?: {
    id: string
    name: string
  } | null
}

interface EditModalProps {
  isOpen: boolean
  document: Document | null
  onClose: () => void
  onSuccess: () => void
}

const CATEGORIES = [
  { value: 'quarterly_report', label: '季度報告', labelEn: 'Quarterly Report' },
  { value: 'monthly_report', label: '月度報告', labelEn: 'Monthly Report' },
  { value: 'agreement', label: '合同協議', labelEn: 'Agreement' },
  { value: 'notice', label: '通知公告', labelEn: 'Notice' },
  { value: 'other', label: '其他', labelEn: 'Other' },
]

export default function EditModal({ isOpen, document, onClose, onSuccess }: EditModalProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('quarterly_report')
  const [fundId, setFundId] = useState('')
  const [funds, setFunds] = useState<Fund[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 获取基金列表
  useEffect(() => {
    if (isOpen) {
      fetch('/api/lp/funds')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setFunds(data.data || [])
          }
        })
        .catch(err => console.error('Error fetching funds:', err))
    }
  }, [isOpen])

  // 初始化表单数据
  useEffect(() => {
    if (document && isOpen) {
      setTitle(document.title)
      setCategory(document.category)
      setFundId(document.fund_id || '')
      setError('')
    }
  }, [document, isOpen])

  if (!isOpen || !document) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // 验证
    if (!title.trim()) {
      setError('請輸入文檔標題')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/lp/documents/${document.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          category,
          fund_id: fundId || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '更新失敗')
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || '更新失敗，請稍後重試')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const getFileTypeName = (type: string) => {
    const types: Record<string, string> = {
      'application/pdf': 'PDF',
      'application/msword': 'DOC',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
      'application/vnd.ms-excel': 'XLS',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    }
    return types[type] || type.split('/').pop()?.toUpperCase() || 'FILE'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 模态框 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">編輯文檔</h2>
            <p className="text-sm text-slate-500 mt-1">Edit Document</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 错误提示 */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* 当前文件信息 */}
          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">{document.title}</p>
                <p className="text-sm text-slate-500">
                  {getFileTypeName(document.file_type)} • {formatFileSize(document.file_size)}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              * 文件不可修改，如需更換文件請刪除後重新上傳
            </p>
          </div>

          {/* 文檔標題 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              文檔標題 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="輸入文檔標題"
            />
          </div>

          {/* 文檔分類 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              文檔分類 <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label} ({cat.labelEn})
                </option>
              ))}
            </select>
          </div>

          {/* 關聯基金 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              關聯基金 <span className="text-slate-400">(可選)</span>
            </label>
            <select
              value={fundId}
              onChange={(e) => setFundId(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
            >
              <option value="">全部基金 (全局文檔)</option>
              {funds.map(fund => (
                <option key={fund.id} value={fund.id}>{fund.name}</option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  保存中...
                </>
              ) : (
                '保存更改'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
