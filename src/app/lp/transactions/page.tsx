'use client'

import { useRouter } from 'next/navigation'
import { Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const transactions = [
  { id: 1, type: 'subscribe', fundName: '天匯成長基金一期', amount: '¥5,000,000', date: '2026-01-15', status: 'completed', nav: 1.2345 },
  { id: 2, type: 'subscribe', fundName: '天匯科技基金', amount: '¥2,000,000', date: '2026-02-01', status: 'pending', nav: 1.1520 },
  { id: 3, type: 'redeem', fundName: '天匯成長基金一期', amount: '¥1,000,000', date: '2026-02-10', status: 'processing', nav: 1.2500 },
]

const statusMap: Record<string, { label: string; color: string }> = {
  completed: { label: '已完成', color: 'bg-green-100 text-green-700' },
  pending: { label: '待審批', color: 'bg-yellow-100 text-yellow-700' },
  processing: { label: '處理中', color: 'bg-blue-100 text-blue-700' },
}

export default function TransactionsPage() {
  const router = useRouter()

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">申購 / 贖回</h1>
          <p className="text-sm text-slate-500 mt-1">Transactions</p>
        </div>
        <button
          onClick={() => router.push('/lp/transactions/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          新增申購
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">類型</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">基金</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">金額</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">NAV</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">日期</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">狀態</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const status = statusMap[tx.status]
                return (
                  <tr key={tx.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'subscribe' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {tx.type === 'subscribe' ? (
                          <ArrowDownRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-900">{tx.fundName}</td>
                    <td className="py-4 px-6 font-semibold text-slate-900">{tx.amount}</td>
                    <td className="py-4 px-6 text-slate-600">{tx.nav.toFixed(4)}</td>
                    <td className="py-4 px-6 text-slate-500">{tx.date}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
