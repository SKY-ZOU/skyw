'use client'

import { Search, Plus, FileDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { generateStatement } from '@/lib/lp-pdf-statement'

interface LPUser {
  id: string
  name: string | null
  email: string
  phone: string | null
  created_at: string
  total_investment: number
  total_value: number
  return_rate: number
  fund_count: number
  status: string
  kyc_status: string
}

export default function LPsPage() {
  const [lps, setLps] = useState<LPUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [generatingPdf, setGeneratingPdf] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/lp/admin/lps')
      .then(res => res.json())
      .then(json => {
        if (json.success) setLps(json.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredLps = lps.filter((lp) => {
    const name = lp.name || lp.email
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lp.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || lp.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleGeneratePdf = async (lp: LPUser) => {
    setGeneratingPdf(lp.id)
    try {
      const res = await fetch(`/api/lp/admin/lps/${lp.id}/portfolio`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error)

      await generateStatement({
        lp: json.data.user,
        portfolio: json.data.portfolio,
        transactions: json.data.transactions,
        generatedAt: new Date(),
      })
    } catch (e) {
      console.error('PDF generation failed:', e)
      alert('生成对账单失败，请重试')
    } finally {
      setGeneratingPdf(null)
    }
  }

  const totalInvestment = lps.reduce((sum, lp) => sum + lp.total_investment, 0)
  const activeLps = lps.filter(l => l.status === 'active').length
  const pendingLps = lps.filter(l => l.status === 'pending').length

  return (
    <div className="p-4 md:p-8 min-h-screen" style={{ background: '#F8FAFC' }}>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#1E293B' }}>投资人管理</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>Investor Management</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition shadow-lg shadow-blue-500/25">
          <Plus className="w-5 h-5" />
          新增投资人
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">总投资人</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{lps.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">活跃投资人</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{activeLps}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">待审核</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingLps}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">总投资额</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            ¥{(totalInvestment / 1_000_000).toFixed(1)}M
          </p>
        </div>
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
            placeholder="搜索投资人..."
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'pending'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {status === 'all' ? '全部' : status === 'active' ? '活跃' : '待审核'}
            </button>
          ))}
        </div>
      </div>

      {/* LPs Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">投资人</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">联系方式</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase">总市值</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase">收益率</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">KYC</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">状态</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredLps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400">暂无投资人数据</td>
                  </tr>
                ) : (
                  filteredLps.map((lp) => {
                    const displayName = lp.name || lp.email
                    const initial = displayName.charAt(0).toUpperCase()
                    return (
                      <tr key={lp.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm"
                              style={{ background: 'linear-gradient(135deg, #070B14 0%, #1E40AF 100%)' }}>
                              {initial}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{displayName}</p>
                              <p className="text-xs text-slate-400">
                                加入 {new Date(lp.created_at).toLocaleDateString('zh-CN')}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm text-slate-900">{lp.email}</p>
                          {lp.phone && <p className="text-xs text-slate-400">{lp.phone}</p>}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <p className="font-semibold text-slate-900">
                            ¥{lp.total_value.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
                          </p>
                          <p className="text-xs text-slate-400">
                            成本 ¥{lp.total_investment.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
                          </p>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className={`font-semibold text-sm ${lp.return_rate >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {lp.return_rate >= 0 ? '+' : ''}{lp.return_rate.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            lp.kyc_status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {lp.kyc_status === 'verified' ? '已验证' : '待验证'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            lp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {lp.status === 'active' ? '活跃' : '待审核'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleGeneratePdf(lp)}
                            disabled={generatingPdf === lp.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50"
                            style={{
                              background: 'linear-gradient(135deg, #D4AF37 0%, #B8960C 100%)',
                              color: '#070B14',
                            }}
                          >
                            <FileDown className="w-3.5 h-3.5" />
                            {generatingPdf === lp.id ? '生成中...' : '对账单'}
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
