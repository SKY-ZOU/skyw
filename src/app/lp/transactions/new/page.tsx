'use client'

/**
 * LP 申购/赎回申请页面
 * 移动端优化的表单页面
 *
 * @module app/lp/transactions/new/page
 * @created 2026-02-18
 */

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Wallet,
  FileText
} from 'lucide-react'

interface Fund {
  id: string
  name: string
  nav: number
  currency: string
  status: string
}

interface Holding {
  fund_id: string
  shares: number
  fund: {
    name: string
    nav: number
  }
}

export default function NewTransactionPage({
  params
}: {
  params: Promise<{ type?: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()

  // 表单状态
  const [type, setType] = useState<'subscribe' | 'redeem'>(resolvedParams?.type === 'redeem' ? 'redeem' : 'subscribe')
  const [fundId, setFundId] = useState('')
  const [amount, setAmount] = useState('')
  const [shares, setShares] = useState('')
  const [note, setNote] = useState('')

  // 数据状态
  const [funds, setFunds] = useState<Fund[]>([])
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // 获取基金和持仓数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取基金列表
        const fundsRes = await fetch('/api/lp/funds')
        const fundsData = await fundsRes.json()
        if (fundsData.success) {
          setFunds(fundsData.data.filter((f: Fund) => f.status === 'active'))
        }

        // 获取用户持仓（用于赎回）
        const holdingsRes = await fetch('/api/lp/holdings')
        const holdingsData = await holdingsRes.json()
        if (holdingsData.success) {
          setHoldings(holdingsData.data)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 当前选择的基金
  const currentFund = funds.find(f => f.id === fundId)
  const currentNav = currentFund?.nav || 1

  // 当前持仓（赎回时）
  const currentHolding = holdings.find(h => h.fund_id === fundId)
  const availableShares = currentHolding?.shares || 0

  // 计算预计份额/金额
  const estimatedShares = type === 'subscribe' && amount ? (parseFloat(amount) / currentNav).toFixed(4) : (shares ? (parseFloat(shares) * currentNav).toFixed(2) : '0')

  // 处理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // 验证
    if (type === 'subscribe') {
      if (!amount || parseFloat(amount) < 1000000) {
        setError('最低申购金额为 HK$1,000,000')
        return
      }
    } else {
      if (!shares || parseFloat(shares) <= 0) {
        setError('请输入赎回份额')
        return
      }
      if (parseFloat(shares) > availableShares) {
        setError('可赎回份额不足')
        return
      }
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/lp/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fund_id: fundId,
          type,
          amount: type === 'subscribe' ? parseFloat(amount) : null,
          shares: type === 'redeem' ? parseFloat(shares) : null,
          note
        })
      })

      const data = await res.json()

      if (data.success) {
        setSuccess(true)
        // 3秒后跳转回交易记录页面
        setTimeout(() => {
          router.push('/lp/transactions')
        }, 2000)
      } else {
        setError(data.error || '提交失败，请重试')
      }
    } catch (err) {
      setError('网络错误，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  // 返回按钮
  const handleBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8FAFC' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm" style={{ color: '#64748B' }}>加载中...</p>
        </div>
      </div>
    )
  }

  // 成功页面
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F8FAFC' }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">申请已提交</h2>
          <p className="text-sm" style={{ color: '#64748B' }}>
            您的{type === 'subscribe' ? '申购' : '赎回'}申请已提交，等待管理员审批
          </p>
          <p className="text-xs mt-4" style={{ color: '#94A3B8' }}>
            即将返回交易记录页面...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      {/* 移动端顶部安全区 */}
      <div className="md:hidden h-16" />

      {/* 顶部导航 */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900">
            {type === 'subscribe' ? '申购申请' : '赎回申请'}
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 交易类型切换 */}
          <div className="bg-white rounded-2xl p-1.5 flex shadow-sm border border-slate-100">
            <button
              type="button"
              onClick={() => { setType('subscribe'); setShares(''); setFundId('') }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                type === 'subscribe'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              申购
            </button>
            <button
              type="button"
              onClick={() => { setType('redeem'); setAmount(''); setFundId('') }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                type === 'redeem'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              赎回
            </button>
          </div>

          {/* 选择基金 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              选择基金
            </label>
            <select
              value={fundId}
              onChange={(e) => setFundId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              required
            >
              <option value="">请选择基金</option>
              {type === 'subscribe' ? (
                funds.map((fund) => (
                  <option key={fund.id} value={fund.id}>
                    {fund.name} - 净值: {fund.nav.toFixed(4)}
                  </option>
                ))
              ) : (
                holdings.filter(h => h.shares > 0).map((holding) => (
                  <option key={holding.fund_id} value={holding.fund_id}>
                    {holding.fund.name} - 可赎回份额: {holding.shares.toLocaleString()}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* 申购金额 / 赎回份额 */}
          {type === 'subscribe' ? (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                申购金额 (HKD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">HK$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-base focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="最低申购金额 HK$1,000,000"
                  min="1000000"
                  step="100000"
                  required
                />
              </div>
              {fundId && amount && parseFloat(amount) >= 1000000 && (
                <div className="mt-3 p-3 bg-green-50 rounded-xl flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">
                    预计获得份额: <strong>{estimatedShares}</strong>
                  </span>
                </div>
              )}
              <p className="mt-2 text-xs" style={{ color: '#94A3B8' }}>
                最低申购金额: HK$1,000,000
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                赎回份额
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-base focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder={`可赎回份额: ${availableShares.toLocaleString()}`}
                  max={availableShares}
                  step="0.0001"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShares(availableShares.toString())}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-600 hover:underline"
                >
                  全部
                </button>
              </div>
              {fundId && shares && parseFloat(shares) > 0 && (
                <div className="mt-3 p-3 bg-red-50 rounded-xl flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700">
                    预计到账金额: <strong>¥{parseFloat(estimatedShares).toLocaleString()}</strong>
                  </span>
                </div>
              )}
              <p className="mt-2 text-xs" style={{ color: '#94A3B8' }}>
                可赎回份额: {availableShares.toLocaleString()}
              </p>
            </div>
          )}

          {/* 备注 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              备注（可选）
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              rows={3}
              placeholder="填写特殊要求或备注信息"
            />
          </div>

          {/* 风险提示 */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">风险提示</p>
                <p className="text-xs opacity-80">
                  {type === 'subscribe' ? (
                    <>
                      申购确认需要1-3个工作日，净值以确认日为准。
                      最低申购金额 HK$1,000,000。
                    </>
                  ) : (
                    <>
                      赎回到账需要3-5个工作日，净值以赎回日为准。
                      赎回后持有份额将相应减少。
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 rounded-xl p-4 flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={submitting || !fundId}
            className={`w-full py-4 rounded-xl font-medium text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
              type === 'subscribe'
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25'
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none`}
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                提交中...
              </>
            ) : (
              <>
                提交{type === 'subscribe' ? '申购' : '赎回'}申请
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
