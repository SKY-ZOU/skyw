'use client'

/**
 * 资产配置饼图组件
 * 使用 Recharts 展示持仓分布
 *
 * @module components/lp/charts/AllocationPieChart
 * @created 2026-02-18
 */

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface AllocationPieChartProps {
  holdings: Array<{
    fund: {
      name: string
    }
    value: number
    shares: number
  }>
}

/**
 * 颜色配置
 */
const COLORS = ['#D4AF37', '#10B981', '#2C74B3', '#8B5CF6', '#EF4444', '#F59E0B']

/**
 * 自定义 Tooltip 样式
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div
        className="p-3 rounded-lg border"
        style={{
          backgroundColor: 'rgba(10, 35, 66, 0.95)',
          borderColor: 'rgba(212, 175, 55, 0.3)',
        }}
      >
        <p style={{ color: '#F8FAFC', fontWeight: 'bold', marginBottom: '4px' }}>
          {data.name}
        </p>
        <p style={{ color: '#D4AF37', fontSize: '14px' }}>
          ¥{data.value.toLocaleString()}
        </p>
        <p style={{ color: '#94A3B8', fontSize: '12px' }}>
          占比: {(data.percent * 100).toFixed(1)}%
        </p>
      </div>
    )
  }
  return null
}

/**
 * 自定义标签渲染
 */
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  // 只显示大于 5% 的标签
  if (percent < 0.05) return null

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: '12px', fontWeight: 500 }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

/**
 * 自定义图例渲染
 */
const renderLegend = (props: any) => {
  const { payload } = props

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span style={{ color: '#64748B', fontSize: '12px' }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export function AllocationPieChart({ holdings }: AllocationPieChartProps) {
  // 计算总值用于百分比
  const totalValue = holdings.reduce((sum, h) => sum + (h.value || 0), 0)

  // 转换数据格式
  const data = holdings.map((h, index) => ({
    name: h.fund?.name || 'Unknown Fund',
    value: h.value || 0,
    shares: h.shares || 0,
    percent: totalValue > 0 ? (h.value || 0) / totalValue : 0,
    fill: COLORS[index % COLORS.length]
  }))

  // 如果没有数据
  if (!holdings || holdings.length === 0) {
    return (
      <div className="h-[350px] flex items-center justify-center text-gray-400">
        暂无持仓数据
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={120}
          innerRadius={50}
          fill="#8884d8"
          dataKey="value"
          animationDuration={1500}
          animationEasing="ease-out"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  )
}
