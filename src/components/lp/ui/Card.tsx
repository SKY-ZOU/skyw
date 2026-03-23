/**
 * 通用卡片组件
 * 白色卡片，12px圆角，阴影
 *
 * @module components/lp/ui/Card
 * @created 2026-02-18
 */

import React from 'react'

interface CardProps {
  title?: string
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
  titleClassName?: string
}

export function Card({ title, children, className = '', action, titleClassName = '' }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
      style={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        borderRadius: '12px',
      }}
    >
      {title && (
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid #E2E8F0' }}
        >
          <h3
            className={`text-lg font-semibold ${titleClassName}`}
            style={{ color: '#1E293B' }}
          >
            {title}
          </h3>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}

export default Card
