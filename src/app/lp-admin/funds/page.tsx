/**
 * 基金管理 - 列表页（含净值上传入口）
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/lp/ui/Card'
import { Button } from '@/components/lp/ui/Button'
import { Badge } from '@/components/lp/ui/Badge'
import { NavUploadModal } from '@/components/lp/funds/NavUploadModal'
import { Upload } from 'lucide-react'

interface Fund {
  id: string
  name: string
  code?: string
  description?: string
  currency: string
  nav: number
  status: string
}

export default function FundsPage() {
  const router = useRouter()
  const [funds, setFunds] = useState<Fund[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadTarget, setUploadTarget] = useState<Fund | null>(null)

  const loadFunds = () => {
    fetch('/api/lp/funds')
      .then(res => res.json())
      .then(json => {
        if (json.success) setFunds(json.data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadFunds()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#F8FAFC' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#D4AF37' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8" style={{ background: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1E293B' }}>基金管理</h1>
            <p className="text-sm mt-1" style={{ color: '#64748B' }}>Fund Management</p>
          </div>
          <Button onClick={() => router.push('/lp-admin/funds/new')}>
            + 创建新基金
          </Button>
        </div>

        <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
          {funds.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">基金名称</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">基金代码</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">币种</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">当前净值</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">状态</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {funds.map((fund) => (
                    <tr key={fund.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-900">{fund.name}</div>
                        {fund.description && (
                          <div className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{fund.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                        {fund.code || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {fund.currency}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold" style={{ color: '#D4AF37' }}>
                          {fund.nav.toFixed(4)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={fund.status === 'active' ? 'success' : 'default'}>
                          {fund.status === 'active' ? '活跃' : '已关闭'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setUploadTarget(fund)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                            style={{
                              background: 'linear-gradient(135deg, #D4AF37 0%, #B8960C 100%)',
                              color: '#070B14',
                            }}
                          >
                            <Upload className="w-3.5 h-3.5" />
                            上传净值
                          </button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => router.push(`/lp-admin/funds/${fund.id}`)}
                          >
                            编辑
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-400 mb-4">暂无基金</p>
              <Button onClick={() => router.push('/lp-admin/funds/new')}>
                创建第一个基金
              </Button>
            </div>
          )}
        </div>
      </div>

      {uploadTarget && (
        <NavUploadModal
          fundId={uploadTarget.id}
          fundName={uploadTarget.name}
          onClose={() => setUploadTarget(null)}
          onSuccess={loadFunds}
        />
      )}
    </div>
  )
}
