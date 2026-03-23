'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface NavChartProps {
  data: { date: string; nav: number }[]
}

export default function NavChart({ data }: NavChartProps) {
  return (
    <div className="h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value.toFixed(2)}
            domain={['dataMin - 0.05', 'dataMax + 0.05']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            }}
            formatter={(value: number | undefined) => [value?.toFixed(4) || '0.0000', 'NAV']}
            labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
          />
          <Area
            type="monotone"
            dataKey="nav"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#navGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
