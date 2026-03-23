'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Download, TrendingUp, Calendar, PiggyBank } from 'lucide-react'
import { generateStatement } from '@/lib/lp-pdf-statement'

interface HoldingDisplay {
  id: string
  fund_id: string
  fund_name: string
  currency: string
  total_shares: number
  cost_basis: number
  current_nav: number
  current_value: number
  return_rate: number
}

interface NavHistoryItem {
  date: string
  nav: number
  return_pct: number
}

export default function HoldingsPage() {
  const { data: session } = useSession()
  const [holdings, setHoldings] = useState<HoldingDisplay[]>([])
  const [navHistory, setNavHistory] = useState<NavHistoryItem[]>([])
  const [portfolio, setPortfolio] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generatingPdf, setGeneratingPdf] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/lp/dashboard').then(r => r.json()),
    ]).then(([dashJson]) => {
      if (dashJson.success) {
        const p = dashJson.data.portfolio
        setPortfolio(p)
        setHoldings(p.holdings || [])

        // 获取第一个基金的净值历史
        if (p.holdings?.length > 0) {
          const fundId = p.holdings[0].fund_id
          fetch(`/api/lp/nav-history?fund_id=${fundId}&limit=10`)
            .then(r => r.json())
            .then(navJson => {
              if (navJson.success) {
                setNavHistory([...navJson.data].reverse())
              }
            })
        }
      }
    }).finally(() => setLoading(false))
  }, [])

  const handleExportPdf = async () => {
    if (!session?.user || !portfolio) return
    setGeneratingPdf(true)
    try {
      const txRes = await fetch('/api/lp/transactions?limit=20')
      const txJson = await txRes.json()

      await generateStatement({
        lp: {
          id: session.user.id || '',
          name: session.user.name || null,
          email: session.user.email || '',
          created_at: new Date().toISOString(),
        },
        portfolio,
        transactions: txJson.data || [],
        generatedAt: new Date(),
      })
    } catch (e) {
      console.error('PDF generation failed:', e)
      alert('生成对账单失败，请重试')
    } finally {
      setGeneratingPdf(false)
    }
  }

  const totalShares = holdings.reduce((s, h) => s + h.total_shares, 0)
  const totalValue = holdings.reduce((s, h) => s + h.current_value, 0)
  const totalCost = holdings.reduce((s, h) => s + h.total_shares * h.cost_basis, 0)
  const totalReturn = totalValue - totalCost

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#F8FAFC' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#D4AF37' }} />
      </div>
    )
  }

  return (
    <div className="p-8" style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">我的份额</h1>
          <p className="mt-1 text-slate-500">查看您持有的基金份额详情</p>
        </div>
        <button
          onClick={handleExportPdf}
          disabled={generatingPdf || holdings.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #B8960C 100%)',
            color: '#070B14',
          }}
        >
          <Download className="h-4 w-4" />
          {generatingPdf ? '生成中...' : '导出对账单'}
        </button>
      </div>

      {/* Summary Cards */}
      {holdings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500">总持有份额</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {totalShares.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
              </p>
              <p className="mt-1 text-sm text-slate-400">{holdings.length} 只基金</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500">总市值</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                ¥{totalValue.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
              </p>
              <p className={`mt-1 text-sm font-medium ${totalReturn >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {totalReturn >= 0 ? '+' : ''}¥{totalReturn.toLocaleString('zh-CN', { maximumFractionDigits: 0 })} (
                {totalCost > 0 ? ((totalReturn / totalCost) * 100).toFixed(1) : '0.0'}%)
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500">总投资成本</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                ¥{totalCost.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
              </p>
              <p className="mt-1 text-sm text-slate-400">累计投入</p>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">份额明细</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">基金名称</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">持有份额</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">买入净值</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">当前净值</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">当前市值</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">收益率</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {holdings.map((holding) => (
                    <tr key={holding.fund_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{holding.fund_name}</p>
                        <p className="text-xs text-slate-400">{holding.currency}</p>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-900">
                        {holding.total_shares.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-slate-600">
                        {holding.cost_basis.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-semibold" style={{ color: '#D4AF37' }}>
                        {holding.current_nav.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-900">
                        {holding.currency} {holding.current_value.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-2 py-1 text-sm font-medium rounded-lg ${
                          holding.return_rate >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                        }`}>
                          {holding.return_rate >= 0 ? '+' : ''}{holding.return_rate.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* NAV History */}
          {navHistory.length > 0 && (
            <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">净值历史</h2>
                <Calendar className="h-5 w-5 text-slate-400" />
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {navHistory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <span className="text-slate-600">{item.date}</span>
                      <div className="flex items-center gap-6">
                        <span className="font-mono font-medium text-slate-900">{item.nav.toFixed(4)}</span>
                        <span className={`text-sm font-medium ${item.return_pct >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {item.return_pct >= 0 ? '+' : ''}{item.return_pct.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <PiggyBank className="w-16 h-16 mx-auto mb-4 text-slate-200" />
          <p className="text-slate-400 text-lg">暂无持仓数据</p>
          <p className="text-slate-300 text-sm mt-2">如有疑问请联系基金管理人</p>
        </div>
      )}
    </div>
  )
}
