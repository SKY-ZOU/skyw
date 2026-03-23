'use client'

import { useState, useEffect } from 'react'
import { Upload, FileText, Download, Trash2, Plus, Search, Loader2, AlertTriangle } from 'lucide-react'
import UploadModal from '@/components/lp/documents/UploadModal'
import EditModal from '@/components/lp/documents/EditModal'

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

const categories = [
  { id: 'all', name: '全部', nameEn: 'All' },
  { id: 'quarterly_report', name: '季度報告', nameEn: 'Quarterly Reports' },
  { id: 'monthly_report', name: '月度報告', nameEn: 'Monthly Reports' },
  { id: 'agreement', name: '合同協議', nameEn: 'Agreements' },
  { id: 'notice', name: '通知公告', nameEn: 'Notices' },
  { id: 'other', name: '其他', nameEn: 'Other' },
]

const categoryColors: Record<string, string> = {
  quarterly_report: 'bg-blue-100 text-blue-700',
  monthly_report: 'bg-cyan-100 text-cyan-700',
  agreement: 'bg-purple-100 text-purple-700',
  notice: 'bg-yellow-100 text-yellow-700',
  other: 'bg-slate-100 text-slate-700',
}

const categoryLabels: Record<string, string> = {
  quarterly_report: '報告',
  monthly_report: '月報',
  agreement: '合同',
  notice: '通知',
  other: '其他',
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // 获取文档列表
  const fetchDocuments = async () => {
    try {
      const url = new URL('/api/lp/documents', window.location.origin)
      if (selectedCategory !== 'all') {
        url.searchParams.set('category', selectedCategory)
      }

      const res = await fetch(url.toString())
      const data = await res.json()

      if (data.success) {
        setDocuments(data.data || [])
      } else {
        console.error('Failed to fetch documents:', data.error)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [selectedCategory])

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id)
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`/api/lp/documents/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (data.success) {
        fetchDocuments()
      } else {
        alert('刪除失敗: ' + data.error)
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('刪除失敗，請稍後重試')
    } finally {
      setDeletingId(null)
      setDeleteConfirm(null)
    }
  }

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('word') || fileType.includes('document')) return '📝'
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊'
    return '📁'
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">文檔管理</h1>
          <p className="text-sm text-slate-500 mt-1">Document Management</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition shadow-lg shadow-blue-500/25"
        >
          <Upload className="w-5 h-5" />
          上傳文檔
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="搜索文檔..."
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-3 text-slate-500">載入中...</span>
        </div>
      )}

      {/* Documents Table */}
      {!loading && (
        <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
          {filteredDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <FileText className="w-12 h-12 mb-3 opacity-50" />
              <p>暫無文檔</p>
              <p className="text-sm">點擊「上傳文檔」開始</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">文檔名稱</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">基金</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">類型</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">大小</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">日期</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-xl">
                            {getFileTypeIcon(doc.file_type)}
                          </div>
                          <span className="font-medium text-slate-900">{doc.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {doc.fund?.name || <span className="text-slate-400">全局</span>}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${categoryColors[doc.category] || 'bg-slate-100 text-slate-700'}`}>
                          {categoryLabels[doc.category] || doc.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600">{formatFileSize(doc.file_size)}</td>
                      <td className="py-4 px-6 text-slate-500">{formatDate(doc.created_at)}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {/* 下载 */}
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="下載"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          {/* 编辑 */}
                          <button
                            onClick={() => setEditingDocument(doc)}
                            className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="編輯"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          {/* 删除 */}
                          <button
                            onClick={() => handleDelete(doc.id)}
                            disabled={deletingId === doc.id}
                            className={`p-2 rounded-lg transition ${
                              deleteConfirm === doc.id
                                ? 'text-white bg-red-600 hover:bg-red-700'
                                : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                            }`}
                            title={deleteConfirm === doc.id ? '確認刪除' : '刪除'}
                          >
                            {deletingId === doc.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : deleteConfirm === doc.id ? (
                              <AlertTriangle className="w-4 h-4" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={fetchDocuments}
      />

      {/* Edit Modal */}
      <EditModal
        isOpen={!!editingDocument}
        document={editingDocument}
        onClose={() => setEditingDocument(null)}
        onSuccess={fetchDocuments}
      />
    </div>
  )
}
