'use client'

/**
 * 文档上传模态框
 * 用于管理员上传新文档
 *
 * @module components/lp/documents/UploadModal
 * @created 2026-02-18
 */

import { useState, useEffect, FormEvent } from 'react'
import { X, Upload, FileText, Loader2 } from 'lucide-react'

interface Fund {
  id: string
  name: string
}

interface UploadModalProps {
  isOpen: boolean
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

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export default function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('quarterly_report')
  const [fundId, setFundId] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [funds, setFunds] = useState<Fund[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)

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

  // 重置表单
  useEffect(() => {
    if (!isOpen) {
      setTitle('')
      setCategory('quarterly_report')
      setFundId('')
      setFile(null)
      setError('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // 验证
    if (!title.trim()) {
      setError('請輸入文檔標題')
      return
    }
    if (!file) {
      setError('請選擇要上傳的文件')
      return
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('不支持的文件類型，僅支持 PDF, DOC, DOCX, XLS, XLSX')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('文件大小不能超過 10MB')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('category', category)
      if (fundId) {
        formData.append('fund_id', fundId)
      }
      formData.append('file', file)

      const res = await fetch('/api/lp/documents', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '上傳失敗')
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || '上傳失敗，請稍後重試')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError('文件大小不能超過 10MB')
        return
      }
      if (!ALLOWED_TYPES.includes(selectedFile.type)) {
        setError('不支持的文件類型')
        return
      }
      setFile(selectedFile)
      setError('')
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      if (droppedFile.size > MAX_FILE_SIZE) {
        setError('文件大小不能超過 10MB')
        return
      }
      if (!ALLOWED_TYPES.includes(droppedFile.type)) {
        setError('不支持的文件類型')
        return
      }
      setFile(droppedFile)
      setError('')
    }
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
            <h2 className="text-xl font-bold text-slate-900">上傳文檔</h2>
            <p className="text-sm text-slate-500 mt-1">Upload Document</p>
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

          {/* 文件上傳 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              選擇文件 <span className="text-red-500">*</span>
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : file
                    ? 'border-green-400 bg-green-50'
                    : 'border-slate-200 hover:border-slate-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-slate-900 text-sm">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="ml-2 p-1 text-slate-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                  <p className="text-sm text-slate-600 mb-1">
                    拖拽文件到這裡，或點擊選擇
                  </p>
                  <p className="text-xs text-slate-400">
                    支持 PDF, DOC, DOCX, XLS, XLSX (最大 10MB)
                  </p>
                </>
              )}
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
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
                  上傳中...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  上傳文檔
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
