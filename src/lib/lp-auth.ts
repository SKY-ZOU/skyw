/**
 * 天汇基金 LP Portal - 认证工具函数（Turso 版）
 */

import bcrypt from 'bcryptjs'
import { lpQueryOne, lpExecute, lpQuery, newId } from '@/lib/lp-turso'
import type { User, UserRole } from '@/lib/lp-db-types'

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    return await lpQueryOne<User>(
      `SELECT * FROM lp_users WHERE email = ?`,
      [email.toLowerCase().trim()]
    )
  } catch {
    return null
  }
}

export interface CreateUserParams {
  email: string
  password: string
  role: UserRole
  name?: string
  phone?: string
}

export interface CreateUserResult {
  user: Omit<User, 'password_hash'> | null
  error: string | null
}

export async function createUser(params: CreateUserParams): Promise<CreateUserResult> {
  try {
    const existing = await findUserByEmail(params.email)
    if (existing) return { user: null, error: '该邮箱已被注册' }

    const passwordHash = await hashPassword(params.password)
    const id = newId()
    const ts = new Date().toISOString()

    await lpExecute(
      `INSERT INTO lp_users (id, email, password_hash, role, name, phone, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, params.email.toLowerCase().trim(), passwordHash, params.role, params.name ?? null, params.phone ?? null, ts]
    )

    const user = await lpQueryOne<User>(`SELECT * FROM lp_users WHERE id = ?`, [id])
    if (!user) return { user: null, error: '创建失败' }

    const { password_hash: _, ...userWithoutHash } = user
    return { user: userWithoutHash, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : '未知错误'
    return { user: null, error: `创建用户异常: ${message}` }
  }
}

export async function getAllUsers() {
  return lpQuery<Omit<User, 'password_hash'>>(
    `SELECT id, email, role, name, phone, created_at FROM lp_users ORDER BY created_at DESC`
  )
}
