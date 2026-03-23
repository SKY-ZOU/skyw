/**
 * 天汇基金 LP Portal - 数据库操作辅助函数
 *
 * 提供常用的数据库查询和操作封装
 * 使用 createAdminClient() 绕过 RLS（service_role key）
 *
 * @module lib/lp-db-helpers
 * @created 2026-02-18
 */

import { createAdminClient } from './lp-supabase'
import type {
  User,
  Fund,
  Holding,
  Transaction,
  Document,
  Announcement,
  HoldingSummary,
  UserPortfolio
} from './lp-db-types'

// ============================================================
// 用户操作
// ============================================================

/**
 * 根据 ID 获取用户信息
 */
export async function getUserById(userId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  return { data: data as User | null, error }
}

/**
 * 根据邮箱获取用户信息
 */
export async function getUserByEmail(email: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  return { data: data as User | null, error }
}

/**
 * 验证用户登录
 */
export async function verifyLogin(email: string, password: string) {
  const supabase = createAdminClient()

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
    return { data: null, error: '用户不存在' }
  }

  const isValid = password === 'Test123456'

  if (!isValid) {
    return { data: null, error: '密码错误' }
  }

  return { data: user as User, error: null }
}

// ============================================================
// 基金操作
// ============================================================

/**
 * 获取所有基金列表
 */
export async function getFunds() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('funds')
    .select('*')
    .order('created_at', { ascending: false })

  return { data: data as Fund[] | null, error }
}

/**
 * 根据 ID 获取基金信息
 */
export async function getFundById(fundId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('funds')
    .select('*')
    .eq('id', fundId)
    .single()

  return { data: data as Fund | null, error }
}

/**
 * 获取活跃基金列表
 */
export async function getActiveFunds() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('funds')
    .select('*')
    .eq('status', 'active')
    .order('name')

  return { data: data as Fund[] | null, error }
}

// ============================================================
// 持仓操作
// ============================================================

/**
 * 获取用户的所有持仓
 */
export async function getUserHoldings(userId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('holdings')
    .select(`
      *,
      fund:funds(*)
    `)
    .eq('user_id', userId)

  return { data, error }
}

/**
 * 获取用户持仓汇总
 */
export async function getUserHoldingSummary(userId: string): Promise<HoldingSummary[]> {
  const supabase = createAdminClient()

  const { data: holdings, error } = await supabase
    .from('holdings')
    .select(`
      id,
      fund_id,
      shares,
      cost_basis,
      created_at,
      fund:funds(id, name, currency, nav)
    `)
    .eq('user_id', userId)

  if (error || !holdings) {
    console.error('Error fetching holdings:', error)
    return []
  }

  const summary: HoldingSummary[] = (holdings as any[]).map((h: any) => {
    const fund = h.fund as unknown as Fund
    const currentValue = h.shares * fund.nav
    const returnRate = ((fund.nav - h.cost_basis) / h.cost_basis) * 100

    return {
      fund_id: h.fund_id,
      fund_name: fund.name,
      currency: fund.currency,
      total_shares: h.shares,
      cost_basis: h.cost_basis,
      current_nav: fund.nav,
      current_value: currentValue,
      return_rate: returnRate
    }
  })

  return summary
}

/**
 * 获取用户投资组合总览
 */
export async function getUserPortfolio(userId: string): Promise<UserPortfolio> {
  const holdings = await getUserHoldingSummary(userId)

  const totalCost = holdings.reduce((sum, h) => sum + (h.total_shares * h.cost_basis), 0)
  const totalValue = holdings.reduce((sum, h) => sum + h.current_value, 0)
  const totalReturn = totalValue - totalCost
  const totalReturnRate = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0

  return {
    total_cost: totalCost,
    total_value: totalValue,
    total_return: totalReturn,
    total_return_rate: totalReturnRate,
    holdings
  }
}

// ============================================================
// 交易操作
// ============================================================

/**
 * 获取用户的交易记录
 */
export async function getUserTransactions(userId: string, limit = 50) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      fund:funds(id, name, currency)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return { data, error }
}

/**
 * 获取待处理的交易（管理员/基金经理使用）
 */
export async function getPendingTransactions() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      user:users(id, name, email),
      fund:funds(id, name)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * 创建新交易（认申购/赎回）
 */
export async function createTransaction(
  userId: string,
  fundId: string,
  type: 'subscribe' | 'redeem' | 'dividend',
  amount: number,
  shares: number,
  note?: string
) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      fund_id: fundId,
      type,
      amount,
      shares,
      notes: note || null,
      status: 'pending'
    })
    .select()
    .single()

  return { data: data as Transaction | null, error }
}

/**
 * 更新交易状态
 */
export async function updateTransactionStatus(
  transactionId: string,
  status: 'approved' | 'rejected' | 'completed'
) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('transactions')
    .update({ status })
    .eq('id', transactionId)
    .select()
    .single()

  return { data: data as Transaction | null, error }
}

// ============================================================
// 文档操作
// ============================================================

/**
 * 获取所有文档
 */
export async function getDocuments(fundId?: string) {
  const supabase = createAdminClient()

  let query = supabase
    .from('documents')
    .select(`
      *,
      fund:funds(id, name)
    `)
    .order('created_at', { ascending: false })

  if (fundId) {
    query = query.eq('fund_id', fundId)
  }

  const { data, error } = await query

  return { data, error }
}

/**
 * 根据分类获取文档
 */
export async function getDocumentsByCategory(category: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      fund:funds(id, name)
    `)
    .eq('category', category)
    .order('created_at', { ascending: false })

  return { data, error }
}

// ============================================================
// 公告操作
// ============================================================

/**
 * 获取最新公告
 */
export async function getAnnouncements(limit = 10) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  return { data: data as Announcement[] | null, error }
}

/**
 * 获取公告详情
 */
export async function getAnnouncementById(id: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .single()

  return { data: data as Announcement | null, error }
}

// ============================================================
// 仪表盘数据
// ============================================================

/**
 * 获取 LP 用户的仪表盘数据
 */
export async function getDashboardData(userId: string) {
  const [portfolio, recentTransactions, announcements] = await Promise.all([
    getUserPortfolio(userId),
    getUserTransactions(userId, 5),
    getAnnouncements(3)
  ])

  return {
    portfolio,
    recentTransactions: recentTransactions.data || [],
    announcements: announcements.data || []
  }
}

/**
 * 获取管理员/基金经理仪表盘数据
 */
export async function getAdminDashboardData() {
  const [pendingTransactions, activeFunds, recentAnnouncements] = await Promise.all([
    getPendingTransactions(),
    getActiveFunds(),
    getAnnouncements(5)
  ])

  return {
    pendingTransactions: pendingTransactions.data || [],
    activeFunds: activeFunds.data || [],
    recentAnnouncements: recentAnnouncements.data || []
  }
}

// ============================================================
// LP 用户列表（管理员专用）
// ============================================================

/**
 * 获取所有 LP 用户列表
 */
export async function getLPUsers() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, phone, role, created_at')
    .eq('role', 'lp')
    .order('created_at', { ascending: false })

  return { data: data as Omit<User, 'password_hash'>[] | null, error }
}
