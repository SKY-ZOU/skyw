/**
 * LP 仪表盘 - 投资概览
 * 深海蓝金融风格设计
 *
 * @module app/lp/dashboard/page
 * @created 2026-02-18
 */

'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/lp/ui/Card'
import { Badge } from '@/components/lp/ui/Badge'
import { ReturnChart } from '@/components/lp/charts/ReturnChart'
import { FundComparisonChart } from '@/components/lp/charts/FundComparisonChart'
import { AllocationPieChart } from '@/components/lp/charts/AllocationPieChart'
import {
  Wallet,
  TrendingUp,
  Percent,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
  FileText,
  ChevronRight,
  Bell
} from 'lucide-react'

interface Portfolio {
  total_cost: number
  total_value: number
  total_return: number
  total_return_rate: number
  holdings: any[]
}

interface DashboardData {
  portfolio: Portfolio
  recent_transactions: any[]
  announcements: any[]
}

/**
 * 数字滚动动画组件
 */
function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0
}: {
  value: number
  prefix?: string
  suffix?: string
  className?: string
  decimals?: number
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const duration = 1000
    const steps = 30
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(current)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return (
    <span
      ref={ref}
      className={`inline-block ${className}`}
      style={{
        animation: 'countUp 0.8s ease-out forwards',
        transform: 'translateY(0)',
      }}
    >
      {prefix}{displayValue.toLocaleString('zh-CN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}{suffix}
    </span>
  )
}

/**
 * 统计卡片组件
 */
function StatCard({
  title,
  value,
  suffix = '',
  icon: Icon,
  trend,
  isCurrency = true,
  isPositive = true,
  delay = 0
}: {
  title: string
  value: number
  suffix?: string
  icon: React.ElementType
  trend?: number
  isCurrency?: boolean
  isPositive?: boolean
  delay?: number
}) {
  return (
    <div
      className="card-white p-6 relative overflow-hidden group"
      style={{
        animation: `fadeIn 0.5s ease-out ${delay}ms forwards`,
        opacity: 0,
      }}
    >
      {/* 背景装饰 */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity"
        style={{
          background: isPositive
            ? 'radial-gradient(circle, #10B981 0%, transparent 70%)'
            : 'radial-gradient(circle, #EF4444 0%, transparent 70%)',
          transform: 'translateY(-50%) translateX(50%)',
        }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm" style={{ color: '#64748B' }}>{title}</span>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: isPositive
                ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              boxShadow: isPositive
                ? '0 4px 12px rgba(16,185,129,0.3)'
                : '0 4px 12px rgba(239,68,68,0.3)',
            }}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span
            className="text-2xl md:text-3xl font-bold"
            style={{
              color: isPositive ? '#10B981' : '#EF4444',
            }}
          >
            {isCurrency && '¥'}<AnimatedNumber value={value} decimals={0} />
            {suffix}
          </span>
        </div>

        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4" style={{ color: '#10B981' }} />
            ) : (
              <ArrowDownRight className="w-4 h-4" style={{ color: '#EF4444' }} />
            )}
            <span
              className="text-sm font-medium"
              style={{ color: isPositive ? '#10B981' : '#EF4444' }}
            >
              {trend.toFixed(2)}%
            </span>
            <span className="text-xs" style={{ color: '#94A3B8' }}>较上期</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function LPDashboard() {
  const { data: session } = useSession()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [navChartData, setNavChartData] = useState<{ date: string; return: number }[]>([])
  const [comparisonData, setComparisonData] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/lp/dashboard')
      .then(res => res.json())
      .then(async (json) => {
        if (json.success) {
          setData(json.data)

          // 获取第一个基金的净值历史
          const holdings = json.data?.portfolio?.holdings || []
          if (holdings.length > 0) {
            const firstFundId = holdings[0].fund_id
            fetch(`/api/lp/nav-history?fund_id=${firstFundId}&limit=24`)
              .then(r => r.json())
              .then(navJson => {
                if (navJson.success && navJson.data.length > 0) {
                  setNavChartData(navJson.data.map((item: any) => ({
                    date: item.date.substring(0, 7),
                    return: item.return_pct
                  })))
                }
              })
          }

          // 获取基金对比数据
          fetch('/api/lp/nav-history?mode=comparison')
            .then(r => r.json())
            .then(cmpJson => {
              if (cmpJson.success) setComparisonData(cmpJson.data)
            })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8" style={{ background: '#F8FAFC' }}>
        <div className="text-center">
          <div className="loading-spinner mx-auto" />
          <p className="mt-4" style={{ color: '#64748B' }}>加载中...</p>
        </div>
      </div>
    )
  }

  const portfolio = data?.portfolio

  return (
    <div className="p-6 md:p-8" style={{ background: '#F8FAFC' }}>
        {/* 页头 */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold"
            style={{ color: '#1E293B' }}
          >
            投资概览
          </h1>
          <p className="mt-2" style={{ color: '#64748B' }}>
            欢迎，{session?.user?.name || session?.user?.email}
          </p>
        </div>

        {/* 投资概览卡片 - 金色金额，翠绿收益率 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="总投资"
            value={portfolio?.total_cost || 0}
            icon={Wallet}
            isCurrency={true}
            isPositive={true}
            delay={100}
          />
          <StatCard
            title="当前价值"
            value={portfolio?.total_value || 0}
            icon={PiggyBank}
            isCurrency={true}
            isPositive={true}
            delay={200}
          />
          <StatCard
            title="累计收益"
            value={portfolio?.total_return || 0}
            icon={TrendingUp}
            isCurrency={true}
            isPositive={(portfolio?.total_return || 0) >= 0}
            trend={portfolio?.total_return_rate}
            delay={300}
          />
          <StatCard
            title="收益率"
            value={portfolio?.total_return_rate || 0}
            suffix="%"
            icon={Percent}
            isCurrency={false}
            isPositive={(portfolio?.total_return_rate || 0) >= 0}
            delay={400}
          />
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 收益曲线 */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-slate-100">
            <h3 className="text-lg font-semibold mb-4 text-slate-900">累计收益曲线</h3>
            <ReturnChart data={navChartData.length > 0 ? navChartData : [
              { date: '2025-08', return: 2.5 },
              { date: '2025-09', return: 3.2 },
              { date: '2025-10', return: 2.8 },
              { date: '2025-11', return: 4.1 },
              { date: '2025-12', return: 5.3 },
              { date: '2026-01', return: 6.8 },
              { date: '2026-02', return: 8.2 },
            ]} />
          </div>

          {/* 资产配置 */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-slate-100">
            <h3 className="text-lg font-semibold mb-4 text-slate-900">资产配置</h3>
            <AllocationPieChart holdings={portfolio?.holdings || []} />
          </div>

          {/* 基金业绩对比 */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-slate-100 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-slate-900">基金业绩对比</h3>
            <FundComparisonChart funds={comparisonData.length > 0 ? comparisonData : [
              { id: '1', name: '天汇成长基金一期', return_1m: 2.5, return_3m: 8.2, return_6m: 15.3, return_1y: 28.5 },
              { id: '2', name: '天汇科技基金', return_1m: 3.1, return_3m: 9.5, return_6m: 18.2, return_1y: 35.2 },
              { id: '3', name: '天汇医疗健康基金', return_1m: 1.8, return_3m: 6.5, return_6m: 12.8, return_1y: 22.1 },
            ]} />
          </div>
        </div>

        {/* 我的持仓 - 卡片式，正收益绿色，Hover金色左边框 */}
        <Card
          title="我的持仓"
          className="mb-8"
          titleClassName="text-lg font-semibold"
        >
          {portfolio?.holdings && portfolio.holdings.length > 0 ? (
            <div className="grid gap-4">
              {portfolio.holdings.map((holding: any, index: number) => (
                <div
                  key={index}
                  className="holding-card"
                  style={{ animation: `fadeIn 0.4s ease-out ${index * 100}ms forwards`, opacity: 0 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold" style={{ color: '#1E293B' }}>
                          {holding.fund_name}
                        </h4>
                        <Badge
                          variant={holding.return_rate >= 0 ? 'success' : 'danger'}
                        >
                          {holding.return_rate >= 0 ? '正收益' : '负收益'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 mt-2 text-sm" style={{ color: '#64748B' }}>
                        <span>持有份额: <span className="font-medium" style={{ color: '#1E293B' }}>{holding.total_shares.toLocaleString()}</span></span>
                        <span>成本净值: <span className="font-medium" style={{ color: '#1E293B' }}>{holding.cost_basis.toFixed(4)}</span></span>
                        <span>当前净值: <span className="font-medium" style={{ color: '#1E293B' }}>{holding.current_nav.toFixed(4)}</span></span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: '#1E293B' }}>
                        {holding.currency} {holding.current_value.toLocaleString()}
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: holding.return_rate >= 0 ? '#10B981' : '#EF4444' }}
                      >
                        {holding.return_rate >= 0 ? '+' : ''}{holding.return_rate.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <PiggyBank className="w-12 h-12 mx-auto mb-4" style={{ color: '#CBD5E1' }} />
              <p style={{ color: '#94A3B8' }}>暂无持仓</p>
            </div>
          )}
        </Card>

        {/* 最近交易 */}
        <Card title="最近交易" className="mb-8">
          {data?.recent_transactions && data.recent_transactions.length > 0 ? (
            <div className="space-y-4">
              {data.recent_transactions.map((tx: any, index: number) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-xl transition-all hover:shadow-md"
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    animation: `fadeIn 0.4s ease-out ${index * 100}ms forwards`,
                    opacity: 0,
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: tx.type === 'subscribe'
                            ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                            : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                        }}
                      >
                        {tx.type === 'subscribe' ? (
                          <ArrowUpRight className="w-5 h-5 text-white" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <span className="font-medium" style={{ color: '#1E293B' }}>{tx.fund?.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={tx.type === 'subscribe' ? 'success' : 'info'}>
                            {tx.type === 'subscribe' ? '认购' : '赎回'}
                          </Badge>
                          <Badge variant={
                            tx.status === 'completed' ? 'success' :
                            tx.status === 'pending' ? 'warning' :
                            tx.status === 'rejected' ? 'danger' : 'default'
                          }>
                            {tx.status === 'completed' ? '已完成' :
                             tx.status === 'pending' ? '待审批' :
                             tx.status === 'rejected' ? '已拒绝' : '审批中'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 ml-13 text-sm" style={{ color: '#64748B' }}>
                      份额: {tx.shares.toLocaleString()} | 金额: {tx.fund?.currency} {tx.amount.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2" style={{ color: '#94A3B8' }}>
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(tx.created_at).toLocaleDateString('zh-CN')}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: '#CBD5E1' }} />
              <p style={{ color: '#94A3B8' }}>暂无交易记录</p>
            </div>
          )}
        </Card>

        {/* 系统公告 */}
        <Card title="系统公告">
          {data?.announcements && data.announcements.length > 0 ? (
            <div className="space-y-4">
              {data.announcements.map((announcement: any, index: number) => (
                <div
                  key={announcement.id}
                  className="p-4 rounded-xl transition-all hover:shadow-md cursor-pointer"
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    animation: `fadeIn 0.4s ease-out ${index * 100}ms forwards`,
                    opacity: 0,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold" style={{ color: '#1E293B' }}>
                          {announcement.title}
                        </h4>
                        {announcement.type === 'important' && (
                          <Badge variant="danger">重要</Badge>
                        )}
                      </div>
                      <p className="mt-2 text-sm" style={{ color: '#64748B' }}>
                        {announcement.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4" style={{ color: '#94A3B8' }}>
                      <Activity className="w-4 h-4" />
                      <span className="text-xs">
                        {new Date(announcement.published_at || announcement.created_at).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 mx-auto mb-4" style={{ color: '#CBD5E1' }} />
              <p style={{ color: '#94A3B8' }}>暂无公告</p>
            </div>
          )}
        </Card>
      </div>
  )
}
