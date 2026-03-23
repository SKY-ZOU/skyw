/**
 * 创建新基金 - 表单页
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/lp/ui/Card'
import { Button } from '@/components/lp/ui/Button'

export default function NewFundPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    currency: 'CNY',
    nav: '1.0000',
    status: 'active'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/lp/funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          nav: parseFloat(formData.nav)
        })
      })

      if (res.ok) {
        alert('基金创建成功！')
        router.push('/lp-admin/funds')
      } else {
        const data = await res.json()
        alert(`创建失败: ${data.error || '未知错误'}`)
      }
    } catch (error) {
      alert('创建失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">创建新基金</h1>
          <p className="mt-2 text-gray-600">填写基金基本信息</p>
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
                placeholder="例如：天汇成长基金"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* 基金代码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                基金代码 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例如：TH001"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
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
                placeholder="简要描述基金的投资策略和目标..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* 币种 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                计价币种 <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="CNY">人民币 (CNY)</option>
                <option value="USD">美元 (USD)</option>
                <option value="HKD">港币 (HKD)</option>
              </select>
            </div>

            {/* 初始净值 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                初始净值 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.0001"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.nav}
                onChange={(e) => setFormData({ ...formData, nav: e.target.value })}
              />
              <p className="mt-1 text-sm text-gray-500">通常为 1.0000</p>
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
                loading={loading}
                className="flex-1"
              >
                创建基金
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                disabled={loading}
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
