/**
 * 统计卡片组件
 * 图标 + 数字，金色金额，翠绿收益率
 *
 * @module components/lp/dashboard/StatCard
 * @created 2026-02-18
 */

import React from 'react'

interface StatCardProps {
  title: string
  titleEn?: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  icon?: React.ReactNode
  gradient?: string
  className?: string
  isCurrency?: boolean
  isPositive?: boolean
  suffix?: string
}

export default function StatCard({
  title,
  titleEn,
  value,
  subtitle,
  trend,
  icon,
  gradient = 'from-blue-500 to-blue-600',
  className = '',
  isCurrency = false,
  isPositive = true,
  suffix = '',
}: StatCardProps) {
  // 根据 isPositive 确定颜色
  const valueColor = isPositive ? '#10B981' : '#EF4444'

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white p-5 md:p-6 ${className}`}
      style={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        borderRadius: '12px',
        border: '1px solid #F1F5F9',
      }}
    >
      {/* 背景渐变装饰 */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5"
        style={{
          background: isPositive
            ? 'radial-gradient(circle, #10B981 0%, transparent 70%)'
            : 'radial-gradient(circle, #EF4444 0%, transparent 70%)',
          transform: 'translateY(-50%) translateX(50%)',
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-medium" style={{ color: '#64748B' }}>{title}</p>
            {titleEn && <p className="text-xs" style={{ color: '#94A3B8' }}>{titleEn}</p>}
          </div>
          {icon && (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{
                background: isPositive
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                boxShadow: isPositive
                  ? '0 4px 12px rgba(16,185,129,0.3)'
                  : '0 4px 12px rgba(239,68,68,0.3)',
              }}
            >
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <p
            className="text-xl md:text-3xl font-bold"
            style={{ color: valueColor }}
          >
            {isCurrency && typeof value === 'number' && '¥'}
            {typeof value === 'number' ? value.toLocaleString('zh-CN') : value}
            {suffix}
          </p>
          {trend && (
            <span
              className="flex items-center text-xs md:text-sm font-semibold"
              style={{ color: trend.isPositive ? '#10B981' : '#EF4444' }}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </span>
          )}
        </div>

        {subtitle && (
          <p className="mt-1.5 text-xs md:text-sm" style={{ color: '#94A3B8' }}>{subtitle}</p>
        )}
      </div>
    </div>
  )
}
