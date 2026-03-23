/**
 * 天汇基金 LP Portal - 数据库操作辅助函数（Turso 版）
 */

import { lpQuery, lpQueryOne, lpExecute, newId, now } from './lp-turso'
import type {
  User, Fund, Holding, Transaction, Document, Announcement,
  HoldingSummary, UserPortfolio
} from './lp-db-types'

// ============================================================
// 用户操作
// ============================================================

export async function getUserById(userId: string) {
  const data = await lpQueryOne<User>(
    `SELECT * FROM lp_users WHERE id = ?`, [userId]
  )
  return { data, error: null }
}

export async function getUserByEmail(email: string) {
  const data = await lpQueryOne<User>(
    `SELECT * FROM lp_users WHERE email = ?`, [email.toLowerCase().trim()]
  )
  return { data, error: null }
}

// ============================================================
// 基金操作
// ============================================================

export async function getFunds() {
  const data = await lpQuery<Fund>(
    `SELECT * FROM lp_funds ORDER BY created_at DESC`
  )
  return { data, error: null }
}

export async function getFundById(fundId: string) {
  const data = await lpQueryOne<Fund>(
    `SELECT * FROM lp_funds WHERE id = ?`, [fundId]
  )
  return { data, error: null }
}

export async function getActiveFunds() {
  const data = await lpQuery<Fund>(
    `SELECT * FROM lp_funds WHERE status = 'active' ORDER BY name`
  )
  return { data, error: null }
}

// ============================================================
// 持仓操作
// ============================================================

export async function getUserHoldings(userId: string) {
  const rows = await lpQuery(
    `SELECT h.*, f.id as fund_id_f, f.name as fund_name, f.currency as fund_currency,
            f.nav as fund_nav, f.status as fund_status, f.created_at as fund_created_at
     FROM lp_holdings h
     JOIN lp_funds f ON f.id = h.fund_id
     WHERE h.user_id = ?`, [userId]
  )
  const data = rows.map((h: any) => ({
    id: h.id, user_id: h.user_id, fund_id: h.fund_id,
    shares: h.shares, cost_basis: h.cost_basis, created_at: h.created_at,
    fund: { id: h.fund_id, name: h.fund_name, currency: h.fund_currency, nav: h.fund_nav, status: h.fund_status, created_at: h.fund_created_at }
  }))
  return { data, error: null }
}

export async function getUserHoldingSummary(userId: string): Promise<HoldingSummary[]> {
  const rows = await lpQuery(
    `SELECT h.fund_id, h.shares, h.cost_basis,
            f.name as fund_name, f.currency, f.nav as current_nav
     FROM lp_holdings h
     JOIN lp_funds f ON f.id = h.fund_id
     WHERE h.user_id = ?`, [userId]
  )
  return (rows as any[]).map((h: any) => ({
    fund_id: h.fund_id,
    fund_name: h.fund_name,
    currency: h.currency,
    total_shares: Number(h.shares),
    cost_basis: Number(h.cost_basis),
    current_nav: Number(h.current_nav),
    current_value: Number(h.shares) * Number(h.current_nav),
    return_rate: ((Number(h.current_nav) - Number(h.cost_basis)) / Number(h.cost_basis)) * 100,
  }))
}

export async function getUserPortfolio(userId: string): Promise<UserPortfolio> {
  const holdings = await getUserHoldingSummary(userId)
  const totalCost = holdings.reduce((s, h) => s + h.total_shares * h.cost_basis, 0)
  const totalValue = holdings.reduce((s, h) => s + h.current_value, 0)
  const totalReturn = totalValue - totalCost
  return {
    total_cost: totalCost,
    total_value: totalValue,
    total_return: totalReturn,
    total_return_rate: totalCost > 0 ? (totalReturn / totalCost) * 100 : 0,
    holdings,
  }
}

// ============================================================
// 交易操作
// ============================================================

export async function getUserTransactions(userId: string, limit = 50) {
  const rows = await lpQuery(
    `SELECT t.*, f.id as f_id, f.name as f_name, f.currency as f_currency
     FROM lp_transactions t
     JOIN lp_funds f ON f.id = t.fund_id
     WHERE t.user_id = ?
     ORDER BY t.created_at DESC LIMIT ?`, [userId, limit]
  )
  const data = rows.map((t: any) => ({
    ...rowToTransaction(t),
    fund: { id: t.f_id, name: t.f_name, currency: t.f_currency }
  }))
  return { data, error: null }
}

export async function getPendingTransactions() {
  const rows = await lpQuery(
    `SELECT t.*,
            u.id as u_id, u.name as u_name, u.email as u_email,
            f.id as f_id, f.name as f_name
     FROM lp_transactions t
     JOIN lp_users u ON u.id = t.user_id
     JOIN lp_funds f ON f.id = t.fund_id
     WHERE t.status = 'pending'
     ORDER BY t.created_at DESC`
  )
  const data = rows.map((t: any) => ({
    ...rowToTransaction(t),
    user: { id: t.u_id, name: t.u_name, email: t.u_email },
    fund: { id: t.f_id, name: t.f_name }
  }))
  return { data, error: null }
}

export async function createTransaction(
  userId: string, fundId: string,
  type: 'subscribe' | 'redeem' | 'dividend',
  amount: number, shares: number, note?: string
) {
  const id = newId()
  const ts = now()
  await lpExecute(
    `INSERT INTO lp_transactions (id, user_id, fund_id, type, amount, shares, notes, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
    [id, userId, fundId, type, amount, shares, note ?? null, ts, ts]
  )
  const data = await lpQueryOne<Transaction>(`SELECT * FROM lp_transactions WHERE id = ?`, [id])
  return { data, error: null }
}

export async function updateTransactionStatus(
  transactionId: string,
  status: 'approved' | 'rejected' | 'completed',
  reviewedBy?: string
) {
  await lpExecute(
    `UPDATE lp_transactions SET status = ?, reviewed_by = ?, reviewed_at = ?, updated_at = ? WHERE id = ?`,
    [status, reviewedBy ?? null, now(), now(), transactionId]
  )
  const data = await lpQueryOne<Transaction>(`SELECT * FROM lp_transactions WHERE id = ?`, [transactionId])
  return { data, error: null }
}

// ============================================================
// 文档操作
// ============================================================

export async function getDocuments(fundId?: string) {
  const sql = fundId
    ? `SELECT d.*, f.id as f_id, f.name as f_name FROM lp_documents d
       LEFT JOIN lp_funds f ON f.id = d.fund_id
       WHERE d.fund_id = ? ORDER BY d.created_at DESC`
    : `SELECT d.*, f.id as f_id, f.name as f_name FROM lp_documents d
       LEFT JOIN lp_funds f ON f.id = d.fund_id
       ORDER BY d.created_at DESC`
  const rows = await lpQuery(sql, fundId ? [fundId] : [])
  const data = rows.map((d: any) => ({
    ...rowToDocument(d),
    fund: d.f_id ? { id: d.f_id, name: d.f_name } : null
  }))
  return { data, error: null }
}

export async function getDocumentsByCategory(category: string) {
  const rows = await lpQuery(
    `SELECT d.*, f.id as f_id, f.name as f_name FROM lp_documents d
     LEFT JOIN lp_funds f ON f.id = d.fund_id
     WHERE d.category = ? ORDER BY d.created_at DESC`, [category]
  )
  const data = rows.map((d: any) => ({
    ...rowToDocument(d),
    fund: d.f_id ? { id: d.f_id, name: d.f_name } : null
  }))
  return { data, error: null }
}

// ============================================================
// 公告操作
// ============================================================

export async function getAnnouncements(limit = 10) {
  const data = await lpQuery<Announcement>(
    `SELECT * FROM lp_announcements ORDER BY created_at DESC LIMIT ?`, [limit]
  )
  return { data, error: null }
}

export async function getAnnouncementById(id: string) {
  const data = await lpQueryOne<Announcement>(
    `SELECT * FROM lp_announcements WHERE id = ?`, [id]
  )
  return { data, error: null }
}

// ============================================================
// 仪表盘
// ============================================================

export async function getDashboardData(userId: string) {
  const [portfolio, recentTransactions, announcements] = await Promise.all([
    getUserPortfolio(userId),
    getUserTransactions(userId, 5),
    getAnnouncements(3),
  ])
  return {
    portfolio,
    recentTransactions: recentTransactions.data || [],
    announcements: announcements.data || [],
  }
}

export async function getAdminDashboardData() {
  const [pendingTransactions, activeFunds, recentAnnouncements] = await Promise.all([
    getPendingTransactions(),
    getActiveFunds(),
    getAnnouncements(5),
  ])
  return {
    pendingTransactions: pendingTransactions.data || [],
    activeFunds: activeFunds.data || [],
    recentAnnouncements: recentAnnouncements.data || [],
  }
}

// ============================================================
// LP 用户列表（管理员）
// ============================================================

export async function getLPUsers() {
  const data = await lpQuery(
    `SELECT id, email, name, phone, role, created_at FROM lp_users
     WHERE role = 'lp' ORDER BY created_at DESC`
  )
  return { data, error: null }
}

// ============================================================
// 内部 row 转换工具
// ============================================================

function rowToTransaction(t: any): Transaction {
  return {
    id: t.id, user_id: t.user_id, fund_id: t.fund_id,
    type: t.type, amount: Number(t.amount), shares: Number(t.shares),
    status: t.status, created_at: t.created_at, updated_at: t.updated_at,
  }
}

function rowToDocument(d: any): Document {
  return {
    id: d.id, fund_id: d.fund_id ?? null, title: d.title,
    file_url: d.file_url, file_type: d.file_type, category: d.category,
    file_size: d.file_size ?? undefined, created_at: d.created_at,
  }
}
