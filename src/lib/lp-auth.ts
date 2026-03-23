/**
 * 天汇基金 LP Portal - 认证工具函数
 *
 * 提供密码加密、验证和用户创建功能
 * 使用 bcryptjs 进行密码哈希（10 rounds）
 *
 * @module lib/lp-auth
 * @created 2026-02-18
 */

import bcrypt from 'bcryptjs'
import { createAdminClient } from '@/lib/lp-supabase'
import type { User, UserRole, UserInsert } from '@/lib/lp-db-types'

// ============================================================
// 常量配置
// ============================================================

/** bcrypt 加密轮数 */
const SALT_ROUNDS = 10

// ============================================================
// 密码工具函数
// ============================================================

/**
 * 加密密码
 * 使用 bcryptjs 进行哈希，10 rounds salt
 *
 * @param password - 明文密码
 * @returns 加密后的密码哈希值
 *
 * @example
 * ```typescript
 * const hash = await hashPassword('mySecurePassword123')
 * // => '$2a$10$...'
 * ```
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  return bcrypt.hash(password, salt)
}

/**
 * 验证密码是否匹配
 *
 * @param password - 用户输入的明文密码
 * @param hashedPassword - 数据库中存储的哈希值
 * @returns 密码是否匹配
 *
 * @example
 * ```typescript
 * const isValid = await verifyPassword('myPassword', user.password_hash)
 * if (!isValid) throw new Error('密码错误')
 * ```
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// ============================================================
// 用户管理函数
// ============================================================

/** 创建用户的参数 */
export interface CreateUserParams {
  /** 用户邮箱 */
  email: string
  /** 明文密码（将自动加密） */
  password: string
  /** 用户角色 */
  role: UserRole
  /** 用户姓名 */
  name?: string
  /** 联系电话 */
  phone?: string
}

/** 创建用户的返回结果 */
export interface CreateUserResult {
  /** 创建成功的用户（不含密码哈希） */
  user: Omit<User, 'password_hash'> | null
  /** 错误信息 */
  error: string | null
}

/**
 * 创建新用户（管理员功能）
 *
 * 1. 检查邮箱是否已存在
 * 2. 加密密码
 * 3. 插入数据库
 *
 * ⚠️ 此函数使用 service_role 密钥，绕过 RLS
 *    应仅在管理员 API 中调用
 *
 * @param params - 用户创建参数
 * @returns 创建结果（包含用户信息或错误）
 *
 * @example
 * ```typescript
 * const result = await createUser({
 *   email: 'investor@example.com',
 *   password: 'securePassword123',
 *   role: 'lp',
 *   name: '张三',
 *   phone: '+86-138-xxxx-xxxx'
 * })
 *
 * if (result.error) {
 *   console.error('创建失败:', result.error)
 * } else {
 *   console.log('创建成功:', result.user)
 * }
 * ```
 */
export async function createUser(params: CreateUserParams): Promise<CreateUserResult> {
  try {
    const supabase = createAdminClient()

    // 1. 检查邮箱是否已存在
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', params.email.toLowerCase().trim())
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = 未找到记录（这是期望的结果）
      return { user: null, error: `查询用户失败: ${checkError.message}` }
    }

    if (existingUser) {
      return { user: null, error: '该邮箱已被注册' }
    }

    // 2. 加密密码
    const passwordHash = await hashPassword(params.password)

    // 3. 插入用户记录
    const insertData: UserInsert = {
      email: params.email.toLowerCase().trim(),
      password_hash: passwordHash,
      role: params.role,
      name: params.name || null,
      phone: params.phone || null,
    }

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert(insertData)
      .select('id, email, role, name, phone, created_at')
      .single()

    if (insertError) {
      return { user: null, error: `创建用户失败: ${insertError.message}` }
    }

    return { user: newUser, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : '未知错误'
    return { user: null, error: `创建用户异常: ${message}` }
  }
}

/**
 * 通过邮箱查找用户（用于登录验证）
 *
 * @param email - 用户邮箱
 * @returns 用户记录或 null
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (error || !data) {
      return null
    }

    return data as User
  } catch {
    return null
  }
}
