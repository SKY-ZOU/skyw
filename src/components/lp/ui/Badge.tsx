/**
 * 标签组件 - 用于状态显示
 * 绿色/红色/灰色
 *
 * @module components/lp/ui/Badge
 * @created 2026-02-18
 */

interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'gold'
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const styles: Record<string, React.CSSProperties> = {
    success: {
      background: 'rgba(16, 185, 129, 0.1)',
      color: '#10B981',
      border: '1px solid rgba(16, 185, 129, 0.2)',
    },
    warning: {
      background: 'rgba(245, 158, 11, 0.1)',
      color: '#F59E0B',
      border: '1px solid rgba(245, 158, 11, 0.2)',
    },
    danger: {
      background: 'rgba(239, 68, 68, 0.1)',
      color: '#EF4444',
      border: '1px solid rgba(239, 68, 68, 0.2)',
    },
    info: {
      background: 'rgba(59, 130, 246, 0.1)',
      color: '#3B82F6',
      border: '1px solid rgba(59, 130, 246, 0.2)',
    },
    default: {
      background: 'rgba(100, 116, 139, 0.1)',
      color: '#64748B',
      border: '1px solid rgba(100, 116, 139, 0.2)',
    },
    gold: {
      background: 'rgba(212, 175, 55, 0.1)',
      color: '#D4AF37',
      border: '1px solid rgba(212, 175, 55, 0.2)',
    },
  }

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={styles[variant]}
    >
      {children}
    </span>
  )
}

export default Badge
