'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, DollarSign, FileText, ArrowUpRight, ArrowDownRight, Bell } from 'lucide-react'

const stats = [
  { title: '總管理規模', titleEn: 'Total AUM', value: '¥520,000,000', change: '+12.5%', isPositive: true, icon: DollarSign, gradient: 'from-blue-500 to-blue-600' },
  { title: '投資人數', titleEn: 'Total LPs', value: '52', change: '+3', isPositive: true, icon: Users, gradient: 'from-cyan-500 to-cyan-600' },
  { title: '基金產品', titleEn: 'Funds', value: '3', change: '', isPositive: true, icon: TrendingUp, gradient: 'from-green-500 to-green-600' },
  { title: '待審批交易', titleEn: 'Pending', value: '5', change: '', isPositive: false, icon: FileText, gradient: 'from-purple-500 to-purple-600' },
]

const recentLps = [
  { id: 1, name: 'Sky Zou', email: 'sky@example.com', investment: '¥5,000,000', date: '2026-02-17', status: 'active' },
  { id: 2, name: 'John Wong', email: 'john@example.com', investment: '¥10,000,000', date: '2026-02-15', status: 'active' },
  { id: 3, name: 'Mary Chen', email: 'mary@example.com', investment: '¥3,000,000', date: '2026-02-10', status: 'pending' },
  { id: 4, name: 'David Lee', email: 'david@example.com', investment: '¥8,000,000', date: '2026-02-05', status: 'active' },
]

const pendingTransactions = [
  { id: 1, type: 'subscribe', lpName: 'John Wong', fundName: '天匯成長基金一期', amount: '¥2,000,000', date: '2026-02-17', status: 'pending' },
  { id: 2, type: 'redeem', lpName: 'Mary Chen', fundName: '天匯科技基金', amount: '¥1,000,000', date: '2026-02-16', status: 'pending' },
  { id: 3, type: 'subscribe', lpName: 'David Lee', fundName: '天匯成長基金一期', amount: '¥5,000,000', date: '2026-02-15', status: 'pending' },
]

const funds = [
  { id: 1, name: '天匯成長基金一期', nameEn: 'SkyW Growth Fund I', nav: 1.2345, lps: 35, aum: '¥350,000,000', status: 'active' },
  { id: 2, name: '天匯科技基金', nameEn: 'SkyW Tech Fund', nav: 1.1520, lps: 12, aum: '¥120,000,000', status: 'active' },
  { id: 3, name: '天匯價值基金', nameEn: 'SkyW Value Fund', nav: 1.0000, lps: 5, aum: '¥50,000,000', status: 'pending' },
]

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">管理控制台</h1>
        <p className="text-sm text-slate-500 mt-1">Management Dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="relative overflow-hidden rounded-2xl bg-white p-5 md:p-6 shadow-sm border border-slate-100">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full -translate-y-8 translate-x-8`} />
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-slate-500">{stat.title}</p>
                    <p className="text-xs text-slate-400">{stat.titleEn}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl md:text-3xl font-bold text-slate-900">{stat.value}</p>
                  {stat.change && (
                    <span className={`flex items-center text-xs md:text-sm font-semibold ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.isPositive ? '↑' : '↓'} {stat.change}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pending Transactions */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">待審批交易</h3>
              <p className="text-sm text-slate-500">Pending Transactions</p>
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
              {pendingTransactions.length} pending
            </span>
          </div>
          <div className="space-y-4">
            {pendingTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.type === 'subscribe' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {tx.type === 'subscribe' ? (
                      <ArrowDownRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{tx.lpName}</p>
                    <p className="text-xs text-slate-500">{tx.fundName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{tx.amount}</p>
                  <p className="text-xs text-slate-400">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition">
            審批交易
          </button>
        </div>

        {/* Recent LPs */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">最近投資人</h3>
              <p className="text-sm text-slate-500">Recent Investors</p>
            </div>
            <a href="/lp-admin/lps" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </a>
          </div>
          <div className="space-y-4">
            {recentLps.map((lp) => (
              <div key={lp.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-medium">
                    {lp.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{lp.name}</p>
                    <p className="text-xs text-slate-500">{lp.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{lp.investment}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${lp.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {lp.status === 'active' ? '活躍' : '待審核'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Funds List */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">基金產品</h3>
            <p className="text-sm text-slate-500">Fund Products</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition">
            + 新增基金
          </button>
        </div>
        <div className="overflow-x-auto -mx-6">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">基金名稱</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">NAV</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">LPs</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">AUM</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">狀態</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {funds.map((fund) => (
                <tr key={fund.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-slate-900">{fund.name}</p>
                      <p className="text-xs text-slate-400">{fund.nameEn}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-900">{fund.nav.toFixed(4)}</td>
                  <td className="py-4 px-6 text-slate-600">{fund.lps}</td>
                  <td className="py-4 px-6 font-medium text-slate-900">{fund.aum}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${fund.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {fund.status === 'active' ? '運作中' : '待啟動'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">管理</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
