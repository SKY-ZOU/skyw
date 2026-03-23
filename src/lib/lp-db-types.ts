/**
 * 天汇基金 LP Portal - 数据库类型定义
 *
 * 本文件定义了与 Supabase 数据库表对应的 TypeScript 类型
 * 确保类型安全，提供完整的类型提示
 *
 * @module lib/lp-db-types
 * @created 2026-02-18
 */

// ============================================================
// 通用类型
// ============================================================

/** JSON 类型（用于 JSONB 字段） */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================================
// 枚举类型
// ============================================================

/** 用户角色 */
export type UserRole = 'admin' | 'fund_manager' | 'lp' | 'compliance'

/** 基金状态 */
export type FundStatus = 'active' | 'closed' | 'pending'

/** 交易类型 */
export type TransactionType = 'subscribe' | 'redeem' | 'dividend'

/** 交易状态 */
export type TransactionStatus = 'pending' | 'approved' | 'rejected' | 'completed'

/** 文档分类 */
export type DocumentCategory = 'report' | 'contract' | 'notice' | 'other'

// ============================================================
// 数据库表行类型
// ============================================================

/**
 * 用户表 - 存储所有系统用户信息
 * @table users
 */
export interface User {
  /** 用户唯一标识符 (UUID) */
  id: string
  /** 用户邮箱（登录账号） */
  email: string
  /** 密码哈希值 */
  password_hash: string
  /** 用户角色 */
  role: UserRole
  /** 用户姓名 */
  name: string | null
  /** 联系电话 */
  phone: string | null
  /** 账户创建时间 */
  created_at: string
}

/**
 * 基金表 - 存储基金产品基本信息
 * @table funds
 */
export interface Fund {
  /** 基金唯一标识符 (UUID) */
  id: string
  /** 基金名称 */
  name: string
  /** 币种：CNY-人民币, USD-美元 */
  currency: string
  /** 当前净值 (Net Asset Value) */
  nav: number
  /** 基金状态 */
  status: FundStatus
  /** 基金创建时间 */
  created_at: string
}

/**
 * 份额表 - 存储用户持有的基金份额信息
 * @table holdings
 */
export interface Holding {
  /** 份额记录唯一标识符 (UUID) */
  id: string
  /** 用户ID（外键） */
  user_id: string
  /** 基金ID（外键） */
  fund_id: string
  /** 持有份额数量 */
  shares: number
  /** 成本基础（平均买入成本） */
  cost_basis: number
  /** 首次持有时间 */
  created_at: string
}

/**
 * 交易表 - 存储认申购、赎回等交易记录
 * @table transactions
 */
export interface Transaction {
  /** 交易唯一标识符 (UUID) */
  id: string
  /** 用户ID（外键） */
  user_id: string
  /** 基金ID（外键） */
  fund_id: string
  /** 交易类型 */
  type: TransactionType
  /** 交易金额 */
  amount: number
  /** 交易份额 */
  shares: number
  /** 交易状态 */
  status: TransactionStatus
  /** 交易创建时间 */
  created_at: string
  /** 交易最后更新时间 */
  updated_at: string
}

/**
 * 文档表 - 存储基金相关文档信息
 * @table documents
 */
export interface Document {
  /** 文档唯一标识符 (UUID) */
  id: string
  /** 关联基金ID（可为空表示全局文档） */
  fund_id: string | null
  /** 文档标题 */
  title: string
  /** 文件存储URL */
  file_url: string
  /** 文件类型：pdf, xlsx, docx等 */
  file_type: string
  /** 文档分类 */
  category: DocumentCategory
  /** 文档上传时间 */
  created_at: string
  /** 文件大小（字节） */
  file_size?: number
}

/**
 * 净值历史表 - 存储基金每日净值记录
 * @table nav_history
 */
export interface NavHistory {
  /** 记录唯一标识符 (UUID) */
  id: string
  /** 基金ID（外键） */
  fund_id: string
  /** 净值日期 (YYYY-MM-DD) */
  date: string
  /** 净值 */
  nav: number
  /** 创建时间 */
  created_at: string
}

/** 创建净值历史记录时的数据类型 */
export type NavHistoryInsert = Omit<NavHistory, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

/**
 * 公告表 - 存储系统公告信息
 * @table announcements
 */
export interface Announcement {
  /** 公告唯一标识符 (UUID) */
  id: string
  /** 公告标题 */
  title: string
  /** 公告内容 */
  content: string
  /** 公告发布时间 */
  created_at: string
}

// ============================================================
// 插入类型（用于创建记录）
// ============================================================

/** 创建用户时的数据类型 */
export type UserInsert = Omit<User, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

/** 创建基金时的数据类型 */
export type FundInsert = Omit<Fund, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

/** 创建份额记录时的数据类型 */
export type HoldingInsert = Omit<Holding, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

/** 创建交易时的数据类型 */
export type TransactionInsert = Omit<Transaction, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  created_at?: string
  updated_at?: string
}

/** 创建文档时的数据类型 */
export type DocumentInsert = Omit<Document, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

/** 创建公告时的数据类型 */
export type AnnouncementInsert = Omit<Announcement, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

// ============================================================
// 更新类型（用于修改记录）
// ============================================================

/** 更新用户时的数据类型 */
export type UserUpdate = Partial<UserInsert>

/** 更新基金时的数据类型 */
export type FundUpdate = Partial<FundInsert>

/** 更新份额记录时的数据类型 */
export type HoldingUpdate = Partial<Omit<HoldingInsert, 'user_id' | 'fund_id'>>

/** 更新交易时的数据类型 */
export type TransactionUpdate = Partial<Omit<TransactionInsert, 'user_id' | 'fund_id'>>

/** 更新文档时的数据类型 */
export type DocumentUpdate = Partial<DocumentInsert>

/** 更新公告时的数据类型 */
export type AnnouncementUpdate = Partial<AnnouncementInsert>

// ============================================================
// 关联查询类型（JOIN 结果）
// ============================================================

/** 持仓详情（包含基金信息） */
export interface HoldingWithFund extends Holding {
  fund: Fund
}

/** 持仓详情（包含用户和基金信息） */
export interface HoldingWithDetails extends Holding {
  user: Pick<User, 'id' | 'name' | 'email'>
  fund: Fund
}

/** 交易详情（包含用户和基金信息） */
export interface TransactionWithDetails extends Transaction {
  user: Pick<User, 'id' | 'name' | 'email'>
  fund: Pick<Fund, 'id' | 'name' | 'currency'>
}

/** 文档详情（包含基金信息） */
export interface DocumentWithFund extends Document {
  fund: Pick<Fund, 'id' | 'name'> | null
}

// ============================================================
// 统计类型
// ============================================================

/** 用户持仓汇总 */
export interface HoldingSummary {
  /** 基金ID */
  fund_id: string
  /** 基金名称 */
  fund_name: string
  /** 币种 */
  currency: string
  /** 总份额 */
  total_shares: number
  /** 成本基础 */
  cost_basis: number
  /** 当前净值 */
  current_nav: number
  /** 当前市值 */
  current_value: number
  /** 收益率 (%) */
  return_rate: number
}

/** 用户总资产 */
export interface UserPortfolio {
  /** 总投资成本 */
  total_cost: number
  /** 总市值 */
  total_value: number
  /** 总收益 */
  total_return: number
  /** 总收益率 (%) */
  total_return_rate: number
  /** 各基金持仓 */
  holdings: HoldingSummary[]
}

// ============================================================
// Supabase Database 类型（完整定义）
// ============================================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: UserInsert
        Update: UserUpdate
      }
      funds: {
        Row: Fund
        Insert: FundInsert
        Update: FundUpdate
      }
      holdings: {
        Row: Holding
        Insert: HoldingInsert
        Update: HoldingUpdate
      }
      transactions: {
        Row: Transaction
        Insert: TransactionInsert
        Update: TransactionUpdate
      }
      documents: {
        Row: Document
        Insert: DocumentInsert
        Update: DocumentUpdate
      }
      announcements: {
        Row: Announcement
        Insert: AnnouncementInsert
        Update: AnnouncementUpdate
      }
      nav_history: {
        Row: NavHistory
        Insert: NavHistoryInsert
        Update: Partial<NavHistoryInsert>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      fund_status: FundStatus
      transaction_type: TransactionType
      transaction_status: TransactionStatus
      document_category: DocumentCategory
    }
  }
}

// ============================================================
// 导出便捷类型
// ============================================================

/** 表行类型映射 */
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

/** 表插入类型映射 */
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']

/** 表更新类型映射 */
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
