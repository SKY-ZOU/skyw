/**
 * 天汇基金 LP Portal - Supabase 客户端统一入口
 *
 * 提供浏览器端和服务端通用的 Supabase 客户端创建函数
 *
 * @module lib/lp-supabase
 * @created 2026-02-18
 */

import { createBrowserClient, createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import type { Database } from './lp-database.types'

// ============================================================
// 类型定义
// ============================================================

/** Supabase 客户端类型 */
export type SupabaseClient = ReturnType<typeof createBrowserClient>

/** 服务端 Supabase 客户端类型 */
export type SupabaseServerClient = ReturnType<typeof createServerClient>

// ============================================================
// 客户端创建函数（浏览器端）
// ============================================================

/**
 * 创建浏览器端 Supabase 客户端
 * 用于客户端组件 (Client Components)
 *
 * @returns 配置好的 Supabase 客户端实例
 *
 * @example
 * ```typescript
 * // 在客户端组件中使用
 * 'use client'
 * import { createClient } from '@/lib/lp-supabase'
 *
 * const supabase = createClient()
 * const { data } = await supabase.from('funds').select('*')
 * ```
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ============================================================
// 服务端创建函数（服务器端）
// ============================================================

/**
 * 创建服务端 Supabase 客户端（带 Cookie 支持）
 * 用于服务器组件 (Server Components) 和 API Routes
 *
 * @returns 配置好的 Supabase 客户端实例
 *
 * @example
 * ```typescript
 * // 在服务器组件中使用
 * import { createServerClient } from '@/lib/lp-supabase'
 *
 * export default async function Page() {
 *   const supabase = await createServerClient()
 *   const { data } = await supabase.from('funds').select('*')
 *   return <div>{JSON.stringify(data)}</div>
 * }
 * ```
 */
export async function createServerClient() {
  const cookieStore = await cookies()

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * 获取所有 Cookie
         */
        getAll() {
          return cookieStore.getAll()
        },
        /**
         * 设置多个 Cookie
         * 注意: 此方法可能在 Server Component 中被调用，需捕获错误
         */
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // 在 Server Component 中调用 setAll 时可能抛出错误
            // 可以忽略，或在 middleware 中处理 session 刷新
            console.warn('Cookie set failed (expected in Server Component):', error)
          }
        },
      },
    }
  )
}

// ============================================================
// 管理员客户端（仅服务端使用）
// ============================================================

/**
 * 创建管理员 Supabase 客户端
 * 使用 service_role 密钥，绕过 RLS 策略
 *
 * ⚠️ 警告: 此客户端应仅在受信任的服务端环境中使用
 *         切勿将其暴露到客户端代码中！
 *
 * @returns 配置好的管理员 Supabase 客户端实例
 *
 * @example
 * ```typescript
 * // 在 API Route 或服务器工具函数中使用
 * import { createAdminClient } from '@/lib/lp-supabase'
 *
 * export async function createUser(email: string, password: string) {
 *   const supabase = createAdminClient()
 *   const { data, error } = await supabase.auth.admin.createUser({
 *     email,
 *     password,
 *     email_confirm: true
 *   })
 *   return { data, error }
 * }
 * ```
 */
export function createAdminClient() {
  // 注意: 仅导入服务端模块，避免客户端 bundle 包含敏感信息
  const { createClient: createSupabaseAdminClient } = require('@supabase/supabase-js')

  return (createSupabaseAdminClient as any)(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ============================================================
// 便捷函数
// ============================================================

/**
 * 获取当前用户
 *
 * @param client - Supabase 客户端实例
 * @returns 当前用户信息或 null
 *
 * @example
 * ```typescript
 * import { createServerClient } from '@/lib/lp-supabase'
 * import { redirect } from 'next/navigation'
 *
 * export async function getUser() {
 *   const supabase = await createServerClient()
 *   const { data: { user }, error } = await supabase.auth.getUser()
 *
 *   if (!user) {
 *     redirect('/lp/login')
 *   }
 *
 *   return user
 * }
 * ```
 */
export async function getUser(client: SupabaseClient | SupabaseServerClient) {
  const { data: { user }, error } = await client.auth.getUser()

  if (error) {
    console.error('Error getting user:', error)
    return null
  }

  return user
}

/**
 * 检查用户是否已认证
 *
 * @param client - Supabase 客户端实例
 * @returns 是否已认证
 */
export async function isAuthenticated(client: SupabaseClient | SupabaseServerClient) {
  const user = await getUser(client)
  return user !== null
}

// ============================================================
// 重新导出类型
// ============================================================

export type { Database } from './lp-database.types'
export type {
  User,
  Fund,
  Holding,
  Transaction,
  Document,
  Announcement,
  UserRole,
  FundStatus,
  TransactionType,
  TransactionStatus,
  DocumentCategory,
  UserInsert,
  FundInsert,
  HoldingInsert,
  TransactionInsert,
  DocumentInsert,
  AnnouncementInsert,
  UserUpdate,
  FundUpdate,
  HoldingUpdate,
  TransactionUpdate,
  DocumentUpdate,
  AnnouncementUpdate
} from './lp-db-types'
