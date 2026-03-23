/**
 * 编辑基金 - 表单页
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/lp/ui/Card'
import { Button } from '@/components/lp/ui/Button'

export default function EditFundPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    nav: '',
    status: 'active'
  })

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  useEffect(() => {
    if (!resolvedParams) return

    fetch(`/api/lp/funds/${resolvedParams.id}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          const fund = json.data
          setFormData({
            name: fund.name,
            description: fund.description || '',
            nav: fund.nav.toString(),
            status: fund.status
          })
        }
      })
      .finally(() => setLoading(false))
  }, [resolvedParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resolvedParams) return

    setSaving(true)

    try {
      const res = await fetch(`/api/lp/funds/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          nav: parseFloat(formData.nav),
          status: formData.status
        })
      })

      if (res.ok) {
        alert('基金更新成功！')
        router.push('/lp-admin/funds')
      } else {
        const data = await res.json()
        alert(`更新失败: ${data.error || '未知错误'}`)
      }
    } catch (error) {
      alert('更新失败，请稍后重试')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">编辑基金</h1>
          <p className="mt-2 text-gray-600">更新基金信息</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基金名称 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                基金名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* 基金描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                基金描述
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* 当前净值 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                当前净值 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.0001"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.nav}
                onChange={(e) => setFormData({ ...formData, nav: e.target.value })}
              />
              <p className="mt-1 text-sm text-gray-500">更新净值将影响所有持仓的当前价值</p>
            </div>

            {/* 状态 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">活跃</option>
                <option value="closed">已关闭</option>
              </select>
            </div>

            {/* 提交按钮 */}
            <div className="flex gap-4">
              <Button
                type="submit"
                loading={saving}
                className="flex-1"
              >
                保存更改
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                disabled={saving}
              >
                取消
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
