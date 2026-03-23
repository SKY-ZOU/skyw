'use client'

/**
 * 收益曲线图组件
 * 使用 Recharts 展示累计收益率曲线
 *
 * @module components/lp/charts/ReturnChart
 * @created 2026-02-18
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ReturnChartProps {
  data: Array<{
    date: string
    return: number
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
        <p style={{ color: '#94A3B8', fontSize: '12px' }}>{label}</p>
        <p style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '14px' }}>
          {payload[0].value.toFixed(2)}%
        </p>
      </div>
    )
  }
  return null
}

export function ReturnChart({ data }: ReturnChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(148, 163, 184, 0.15)"
          vertical={false}
        />
        <XAxis
          dataKey="date"
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
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="circle"
        />
        <Line
          type="monotone"
          dataKey="return"
          stroke="#D4AF37"
          strokeWidth={2.5}
          dot={{
            fill: '#D4AF37',
            r: 4,
            strokeWidth: 2,
            stroke: '#fff'
          }}
          activeDot={{
            r: 6,
            fill: '#D4AF37',
            stroke: '#fff',
            strokeWidth: 2
          }}
          name="累计收益率"
          animationDuration={1500}
          animationEasing="ease-out"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
