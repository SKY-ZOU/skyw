'use client'

import { useState } from 'react'
import { Download, FileText, Calendar, Search, File, FileImage } from 'lucide-react'

// 模拟数据
const documents = [
  { id: '1', title: '2026年1月基金月报', fundName: '天汇成长基金一期', category: 'report', date: '2026-02-05', fileType: 'pdf', size: '2.3 MB' },
  { id: '2', title: '2025年12月基金月报', fundName: '天汇成长基金一期', category: 'report', date: '2026-01-05', fileType: 'pdf', size: '2.1 MB' },
  { id: '3', title: '私募基金合同', fundName: '天汇成长基金一期', category: 'contract', date: '2024-01-01', fileType: 'pdf', size: '1.5 MB' },
  { id: '4', title: '合伙协议', fundName: '天汇成长基金一期', category: 'contract', date: '2024-01-01', fileType: 'pdf', size: '0.8 MB' },
  { id: '5', title: '2025年第三季度报告', fundName: '天汇科技基金', category: 'report', date: '2025-10-15', fileType: 'pdf', size: '1.8 MB' },
  { id: '6', title: '投资策略调整通知', fundName: '全部基金', category: 'notice', date: '2026-01-20', fileType: 'pdf', size: '0.3 MB' },
]

const categories = [
  { id: 'all', name: '全部', count: 6 },
  { id: 'report', name: '定期报告', count: 3 },
  { id: 'contract', name: '合同协议', count: 2 },
  { id: 'notice', name: '通知公告', count: 1 },
]

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'report':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">定期报告</span>
      case 'contract':
        return <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">合同协议</span>
      case 'notice':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded">通知公告</span>
      default:
        return null
    }
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />
      case 'xlsx':
      case 'xls':
        return <File className="h-8 w-8 text-green-500" />
      default:
        return <File className="h-8 w-8 text-slate-400" />
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">文档中心</h1>
        <p className="mt-1 text-slate-500">下载基金报告、合同及其他文件</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="搜索文档..."
          />
        </div>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="rounded-xl bg-white p-5 shadow-sm border border-slate-100 hover:shadow-md transition group"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">{getFileIcon(doc.fileType)}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-900 truncate">{doc.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{doc.fundName}</p>
                <div className="flex items-center gap-3 mt-2">
                  {getCategoryBadge(doc.category)}
                  <span className="text-xs text-slate-400">{doc.size}</span>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-slate-400">
                  <Calendar className="h-3 w-3" />
                  {doc.date}
                </div>
              </div>
            </div>
            <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-blue-600 hover:text-white transition">
              <Download className="h-4 w-4" />
              下载
            </button>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <File className="h-12 w-12 mx-auto text-slate-300" />
          <p className="mt-4">未找到相关文档</p>
        </div>
      )}
    </div>
  )
}
