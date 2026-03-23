/**
 * 通用按钮组件
 * 金色主按钮，透明次按钮
 *
 * @module components/lp/ui/Button
 * @created 2026-02-18
 */

import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center gap-2'

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-blue-500/25 hover:shadow-blue-500/40',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 border border-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-red-500/25 hover:shadow-red-500/40',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    gold: `text-[#0A2342] font-semibold focus:ring-[#D4AF37]`
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  // 金色主按钮特殊样式
  const goldStyles = variant === 'gold' ? {
    background: 'linear-gradient(135deg, #D4AF37 0%, #E8C756 50%, #D4AF37 100%)',
    boxShadow: '0 4px 16px rgba(212,175,55,0.3)',
    border: 'none',
  } : {}

  const goldHoverStyles = variant === 'gold' ? {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(212,175,55,0.4)',
  } : {}

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={disabled || loading}
      style={goldStyles}
      onMouseEnter={(e) => {
        if (!disabled && !loading && variant === 'gold') {
          Object.assign(e.currentTarget.style, goldHoverStyles)
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'gold') {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,175,55,0.3)'
        }
      }}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          处理中...
        </span>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
