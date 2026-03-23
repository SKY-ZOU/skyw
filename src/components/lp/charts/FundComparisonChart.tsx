'use client'

/**
 * 基金业绩对比图组件
 * 使用 Recharts 展示不同时间段基金业绩对比
 *
 * @module components/lp/charts/FundComparisonChart
 * @created 2026-02-18
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface FundComparisonChartProps {
  funds: Array<{
    id: string
    name: string
    return_1m?: number
    return_3m?: number
    return_6m?: number
    return_1y?: number
  }>
}

/**
 * 自定义 Tooltip 样式
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="p-3 rounded-lg border"
        style={{
          backgroundColor: 'rgba(10, 35, 66, 0.95)',
          borderColor: 'rgba(212, 175, 55, 0.3)',
        }}
      >
        <p style={{ color: '#F8FAFC', fontWeight: 'bold', marginBottom: '8px' }}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color, fontSize: '12px' }}>
            {entry.name}: {entry.value?.toFixed(2)}%
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function FundComparisonChart({ funds }: FundComparisonChartProps) {
  // 转换数据格式
  const data = funds.map(fund => ({
    name: fund.name.length > 8 ? fund.name.substring(0, 8) + '...' : fund.name,
    fullName: fund.name,
    return_1m: fund.return_1m || 0,
    return_3m: fund.return_3m || 0,
    return_6m: fund.return_6m || 0,
    return_1y: fund.return_1y || 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        barSize={24}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(148, 163, 184, 0.15)"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          stroke="#94A3B8"
          style={{ fontSize: '12px' }}
          tickLine={false}
          axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
        />
        <YAxis
          stroke="#94A3B8"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `${value}%`}
          tickLine={false}
          axisLine={false}
          width={50}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
        <Legend
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="circle"
          formatter={(value) => <span style={{ color: '#64748B', fontSize: '12px' }}>{value}</span>}
        />
        <Bar
          dataKey="return_1m"
          fill="#D4AF37"
          name="1个月"
          radius={[4, 4, 0, 0]}
          animationDuration={1500}
        />
        <Bar
          dataKey="return_3m"
          fill="#10B981"
          name="3个月"
          radius={[4, 4, 0, 0]}
          animationDuration={1500}
          animationBegin={200}
        />
        <Bar
          dataKey="return_6m"
          fill="#2C74B3"
          name="6个月"
          radius={[4, 4, 0, 0]}
          animationDuration={1500}
          animationBegin={400}
        />
        <Bar
          dataKey="return_1y"
          fill="#8B5CF6"
          name="1年"
          radius={[4, 4, 0, 0]}
          animationDuration={1500}
          animationBegin={600}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
