/**
 * 天汇基金 LP Portal - Turso 数据库客户端
 * 使用与官网相同的 Turso 数据库（lp_ 前缀表）
 */

function getClient() {
  // 懒加载，避免 Netlify Lambda 冷启动崩溃
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require('@libsql/client/web')
  return createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  })
}

type Row = Record<string, unknown>

/** 执行查询，返回所有行 */
export async function lpQuery<T = Row>(sql: string, args: unknown[] = []): Promise<T[]> {
  const db = getClient()
  const result = await db.execute({ sql, args })
  // libSQL 返回 Row 对象，转为普通对象
  return result.rows.map((row: any) => {
    const obj: Row = {}
    for (const key of Object.keys(row)) {
      obj[key] = row[key]
    }
    return obj as T
  })
}

/** 执行查询，返回单行（找不到返回 null） */
export async function lpQueryOne<T = Row>(sql: string, args: unknown[] = []): Promise<T | null> {
  const rows = await lpQuery<T>(sql, args)
  return rows[0] ?? null
}

/** 执行写操作（INSERT/UPDATE/DELETE），返回影响行数 */
export async function lpExecute(sql: string, args: unknown[] = []): Promise<number> {
  const db = getClient()
  const result = await db.execute({ sql, args })
  return result.rowsAffected ?? 0
}

/** 批量执行（事务） */
export async function lpBatch(statements: { sql: string; args?: unknown[] }[]): Promise<void> {
  const db = getClient()
  await db.batch(
    statements.map(s => ({ sql: s.sql, args: s.args ?? [] })),
    'write'
  )
}

/** 生成 UUID */
export function newId(): string {
  return crypto.randomUUID()
}

/** 当前 ISO 时间字符串 */
export function now(): string {
  return new Date().toISOString()
}
