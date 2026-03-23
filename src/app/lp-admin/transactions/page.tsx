'use client'

/**
 * 管理员交易审批页面
 * 显示所有待审批交易，支持批准/拒绝操作
 * 移动端优化设计
 *
 * @module app/lp-admin/transactions/page
 * @created 2026-02-18
 */

import { useState, useEffect, use } from 'react'
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  Filter,
  ChevronLeft
} from 'lucide-react'
import Link from 'next/link'
import { ApprovalModal } from '@/components/lp/transactions/ApprovalModal'

interface Transaction {
  id: string
  type: 'subscribe' | 'redeem' | 'dividend'
  user_id: string
  fund_id: string
  amount: number | null
  shares: number | null
  nav: number | null
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  notes: string | null
  created_at: string
  user: {
    id: string
    name: string
    email: string
  }
  fund: {
    id: string
    name: string
  }
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 审批模态框状态
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)

  // 获取交易列表
  const fetchTransactions = async () => {
    setLoading(true)
    try {
      // 先尝试获取待审批的交易
      const pendingRes = await fetch('/api/lp/transactions?status=pending')
      const pendingData = await pendingRes.json()

      // 获取所有交易（用于已完成/已拒绝的查看）
      const allRes = await fetch('/api/lp/transactions?limit=100')
      const allData = await allRes.json()

      if (allData.success) {
        setTransactions(allData.data)
      }
    } catch (err) {
      console.error('Error fetching transactions:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  // 批准交易
  const handleApprove = async (id: string, nav: number, note: string) => {
    setProcessing(id)

    try {
      const res = await fetch(`/api/lp/transactions/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nav, note })
      })

      const data = await res.json()

      if (data.success) {
        // 更新本地状态
        setTransactions(prev => prev.map(t =>
          t.id === id
            ? { ...t, status: 'approved' as const, nav, notes: note }
            : t
        ))
      } else {
        throw new Error(data.error || '批准失败')
      }
    } catch (err) {
      console.error('Error approving:', err)
      throw err
    } finally {
      setProcessing(null)
    }
  }

  // 拒绝交易
  const handleReject = async (id: string, note: string) => {
    setProcessing(id)

    try {
      const res = await fetch(`/api/lp/transactions/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note })
      })

      const data = await res.json()

      if (data.success) {
        // 更新本地状态
        setTransactions(prev => prev.map(t =>
          t.id === id
            ? { ...t, status: 'rejected' as const, notes: note }
            : t
        ))
      } else {
        throw new Error(data.error || '拒绝失败')
      }
    } catch (err) {
      console.error('Error rejecting:', err)
      throw err
    } finally {
      setProcessing(null)
    }
  }

  // 过滤交易
  const filteredTx = transactions.filter((tx) => {
    // 状态过滤
    if (statusFilter !== 'all' && tx.status !== statusFilter) return false

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchUser = tx.user?.name?.toLowerCase().includes(query)
      const matchFund = tx.fund?.name?.toLowerCase().includes(query)
      if (!matchUser && !matchFund) return false
    }

    return true
  })

  // 统计
  const pendingCount = transactions.filter(t => t.status === 'pending').length
  const completedCount = transactions.filter(t => t.status === 'completed' || t.status === 'approved').length
  const rejectedCount = transactions.filter(t => t.status === 'rejected').length

  // 状态徽章
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-700', text: '待审批' }
      case 'approved':
      case 'completed':
        return { color: 'bg-green-100 text-green-700', text: status === 'completed' ? '已完成' : '已批准' }
      case 'rejected':
        return { color: 'bg-red-100 text-red-700', text: '已拒绝' }
      default:
        return { color: 'bg-gray-100 text-gray-700', text: status }
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      {/* 移动端顶部安全区 */}
      <div className="md:hidden h-16" />

      {/* 顶部导航 - 移动端 */}
      <div className="md:hidden bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <Link href="/lp-admin" className="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">交易审批</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Header - 桌面端 */}
        <div className="hidden md:block mb-6">
          <h1 className="text-2xl font-bold text-slate-900">交易审批</h1>
          <p className="text-sm text-slate-500 mt-1">Transaction Approvals</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => setStatusFilter('pending')}
            className={`bg-white rounded-xl p-4 border text-left transition ${
              statusFilter === 'pending' ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-slate-100'
            }`}
          >
            <div className="flex items-center gap-2 text-yellow-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs">待审批</span>
            </div>
            <p className="text-xl font-bold text-slate-900">{pendingCount}</p>
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`bg-white rounded-xl p-4 border text-left transition ${
              statusFilter === 'completed' ? 'border-green-400 ring-2 ring-green-100' : 'border-slate-100'
            }`}
          >
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs">已完成</span>
            </div>
            <p className="text-xl font-bold text-slate-900">{completedCount}</p>
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`bg-white rounded-xl p-4 border text-left transition ${
              statusFilter === 'rejected' ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-100'
            }`}
          >
            <div className="flex items-center gap-2 text-red-600 mb-1">
              <XCircle className="w-4 h-4" />
              <span className="text-xs">已拒绝</span>
            </div>
            <p className="text-xl font-bold text-slate-900">{rejectedCount}</p>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索LP姓名或基金名称..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {['all', 'pending', 'completed', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status === 'all' ? '全部' :
                   status === 'pending' ? '待审批' :
                   status === 'completed' ? '已完成' : '已拒绝'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-sm text-slate-500">加载中...</p>
          </div>
        ) : filteredTx.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
            <Clock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500">暂无交易记录</p>
          </div>
        ) : (
          /* Transactions List */
          <div className="space-y-3">
            {filteredTx.map((tx) => {
              const statusBadge = getStatusBadge(tx.status)
              const isPending = tx.status === 'pending'

              return (
                <div
                  key={tx.id}
                  className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100 hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left - User & Fund */}
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        tx.type === 'subscribe' ? 'bg-green-100' : tx.type === 'redeem' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {tx.type === 'subscribe' ? (
                          <ArrowDownRight className="w-5 h-5 text-green-600" />
                        ) : tx.type === 'redeem' ? (
                          <ArrowUpRight className="w-5 h-5 text-red-600" />
                        ) : (
                          <span className="text-blue-600 font-bold text-sm">分</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-900">{tx.user?.name}</span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            tx.type === 'subscribe' ? 'bg-green-100 text-green-700' :
                            tx.type === 'redeem' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {tx.type === 'subscribe' ? '申购' : tx.type === 'redeem' ? '赎回' : '分红'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">{tx.fund?.name}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(tx.created_at).toLocaleDateString('zh-CN')} · {tx.user?.email}
                        </p>
                      </div>
                    </div>

                    {/* Right - Amount & Status */}
                    <div className="flex items-center justify-between md:justify-end gap-4 pl-14 md:pl-0">
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          {tx.type === 'subscribe' ? (
                            <>¥{tx.amount?.toLocaleString()}</>
                          ) : tx.type === 'redeem' ? (
                            <>{tx.shares?.toLocaleString()} 份额</>
                          ) : (
                            <>¥{tx.amount?.toLocaleString()}</>
                          )}
                        </p>
                        {tx.nav && (
                          <p className="text-xs text-slate-400">净值: {tx.nav.toFixed(4)}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${statusBadge.color}`}>
                          {statusBadge.text}
                        </span>

                        {isPending && (
                          <button
                            onClick={() => setSelectedTx(tx)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition flex items-center gap-1 min-h-[44px]"
                          >
                            <Filter className="w-4 h-4" />
                            审批
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 备注显示 */}
                  {tx.notes && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-500">
                        <span className="font-medium">备注:</span> {tx.notes}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Approval Modal */}
      <ApprovalModal
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  )
}
