'use client'

/**
 * 管理员审批模态框组件
 * 用于审批/拒绝 LP 的申购赎回申请
 *
 * @module components/lp/transactions/ApprovalModal
 * @created 2026-02-18
 */

import { useState, useEffect } from 'react'
import {
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calculator,
  RefreshCw
} from 'lucide-react'

interface Transaction {
  id: string
  type: 'subscribe' | 'redeem' | 'dividend'
  user: {
    name: string
    email: string
  }
  fund: {
    name: string
  }
  amount: number | null
  shares: number | null
  nav: number | null
  notes: string | null
  created_at: string
}

interface ApprovalModalProps {
  transaction: Transaction | null
  onClose: () => void
  onApprove: (id: string, nav: number, note: string) => Promise<void>
  onReject: (id: string, note: string) => Promise<void>
}

export function ApprovalModal({
  transaction,
  onClose,
  onApprove,
  onReject
}: ApprovalModalProps) {
  const [nav, setNav] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 当选中交易时，初始化净值
  useEffect(() => {
    if (transaction) {
      setNote(transaction.notes || '')
      // 默认使用当前日期的净值（这里简化处理，实际应从基金数据获取）
      setNav('')
    }
  }, [transaction])

  if (!transaction) return null

  // 计算结果
  const isSubscribe = transaction.type === 'subscribe'
  const inputValue = isSubscribe ? transaction.amount : transaction.shares
  const calculatedResult = nav && parseFloat(nav) > 0
    ? (isSubscribe
        ? (transaction.amount! / parseFloat(nav)).toFixed(4)
        : (transaction.shares! * parseFloat(nav)).toFixed(2)
      )
    : null

  // 处理批准
  const handleApprove = async () => {
    if (!nav || parseFloat(nav) <= 0) {
      setError('请输入有效的净值')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onApprove(transaction.id, parseFloat(nav), note)
      onClose()
    } catch (err) {
      setError('操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 处理拒绝
  const handleReject = async () => {
    if (!note.trim()) {
      setError('请填写拒绝原因')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onReject(transaction.id, note)
      onClose()
    } catch (err) {
      setError('操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">
            审批{isSubscribe ? '申购' : '赎回'}申请
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* 申请人信息 */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase">申请人</span>
            </div>
            <p className="font-semibold text-slate-900">{transaction.user?.name}</p>
            <p className="text-sm text-slate-500">{transaction.user?.email}</p>
          </div>

          {/* 交易信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">基金名称</p>
              <p className="font-medium text-slate-900">{transaction.fund?.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">申请日期</p>
              <p className="font-medium text-slate-900">
                {new Date(transaction.created_at).toLocaleDateString('zh-CN')}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-slate-500 mb-1">
                {isSubscribe ? '申购金额' : '赎回份额'}
              </p>
              <p className="font-bold text-lg text-slate-900">
                {isSubscribe ? (
                  <>¥{transaction.amount?.toLocaleString()}</>
                ) : (
                  <>{transaction.shares?.toLocaleString()} 份额</>
                )}
              </p>
            </div>
          </div>

          {/* 净值输入 */}
          <div className="border-t border-slate-100 pt-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              确认净值 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={nav}
                onChange={(e) => setNav(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="请输入确认日净值"
                step="0.0001"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <button
                  type="button"
                  onClick={() => setNav('1.0000')}
                  className="text-xs text-blue-600 hover:underline"
                >
                  设为1.0000
                </button>
              </div>
            </div>

            {/* 计算结果 */}
            {calculatedResult && (
              <div className="mt-3 p-3 bg-blue-50 rounded-xl flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700">
                  {isSubscribe ? (
                    <>计算份额: <strong>{calculatedResult}</strong></>
                  ) : (
                    <>计算金额: <strong>¥{parseFloat(calculatedResult).toLocaleString()}</strong></>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* 备注 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              备注
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              rows={3}
              placeholder={loading ? '' : '批准时可填写确认信息，拒绝时需填写原因'}
            />
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="p-3 bg-red-50 rounded-xl flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-slate-100 flex gap-3">
          <button
            onClick={handleReject}
            disabled={loading}
            className="flex-1 py-3 px-4 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2 min-h-[48px]"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                拒绝
              </>
            )}
          </button>
          <button
            onClick={handleApprove}
            disabled={loading || !nav}
            className="flex-1 py-3 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2 min-h-[48px]"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                批准
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
