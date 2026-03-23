/**
 * 天汇基金 LP Portal - 认证上下文提供者
 *
 * 封装 NextAuth SessionProvider，提供全局认证状态
 * 用于 RootLayout 包裹整个应用
 *
 * @module components/lp/AuthProvider
 * @created 2026-02-18
 */

'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

/**
 * 认证上下文提供者
 *
 * 在 layout.tsx 中使用，为所有页面提供 session 状态
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import AuthProvider from '@/components/lp/AuthProvider'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AuthProvider>{children}</AuthProvider>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider
      // 每 5 分钟自动刷新 session（保持登录状态）
      refetchInterval={5 * 60}
      // 窗口获得焦点时刷新 session
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  )
}
