/**
 * PDF 对账单生成
 * 使用 jsPDF + jspdf-autotable 在客户端生成 PDF
 */

import type { HoldingSummary, UserPortfolio } from './lp-db-types'

interface User {
  id: string
  name: string | null
  email: string
  phone?: string | null
  created_at: string
}

interface Transaction {
  id: string
  type: string
  amount: number
  shares: number
  status: string
  created_at: string
  fund?: { name: string; currency: string }
}

export interface StatementData {
  lp: User
  portfolio: UserPortfolio
  transactions: Transaction[]
  generatedAt?: Date
}

function formatCurrency(value: number): string {
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export async function generateStatement(data: StatementData): Promise<void> {
  // 动态导入以避免 SSR 问题
  const jsPDF = (await import('jspdf')).default
  const autoTable = (await import('jspdf-autotable')).default

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const primary = [7, 11, 20] as [number, number, number]     // #070B14 深海蓝
  const gold = [212, 175, 55] as [number, number, number]     // #D4AF37 金色
  const lightGray = [248, 250, 252] as [number, number, number]
  const textGray = [100, 116, 139] as [number, number, number]

  const pageW = 210
  let y = 0

  // ─── Header Background ───
  doc.setFillColor(...primary)
  doc.rect(0, 0, pageW, 40, 'F')

  // Title
  doc.setTextColor(212, 175, 55)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('SkyW Capital', 15, 18)

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('LP Investor Statement', 15, 28)
  doc.text('投资人对账单', 15, 35)

  // Generated date (right side)
  const genDate = (data.generatedAt || new Date()).toLocaleDateString('zh-CN')
  doc.setFontSize(9)
  doc.setTextColor(200, 200, 200)
  doc.text(`生成日期: ${genDate}`, pageW - 15, 28, { align: 'right' })

  y = 50

  // ─── LP Info ───
  doc.setFillColor(...lightGray)
  doc.rect(15, y, pageW - 30, 22, 'F')

  doc.setTextColor(...primary)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('投资人信息', 20, y + 8)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...textGray)
  const lpName = data.lp.name || data.lp.email
  doc.text(`姓名: ${lpName}`, 20, y + 15)
  doc.text(`邮箱: ${data.lp.email}`, 80, y + 15)
  if (data.lp.phone) doc.text(`电话: ${data.lp.phone}`, 150, y + 15)

  y += 30

  // ─── Portfolio Summary ───
  doc.setTextColor(...primary)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('投资概览', 15, y)

  y += 6

  const p = data.portfolio
  const summaryData = [
    ['总投资成本', `¥ ${formatCurrency(p.total_cost)}`],
    ['当前市值', `¥ ${formatCurrency(p.total_value)}`],
    ['累计收益', `¥ ${formatCurrency(p.total_return)}`],
    ['总收益率', formatPercent(p.total_return_rate)],
  ]

  autoTable(doc, {
    startY: y,
    body: summaryData,
    columnStyles: {
      0: { cellWidth: 60, fontStyle: 'bold', textColor: textGray },
      1: { cellWidth: 80, halign: 'right', fontStyle: 'bold', textColor: p.total_return >= 0 ? [16, 185, 129] : [239, 68, 68] },
    },
    styles: { fontSize: 10, cellPadding: 4, lineColor: [226, 232, 240] },
    theme: 'grid',
    margin: { left: 15, right: 15 },
  })

  y = (doc as any).lastAutoTable.finalY + 10

  // ─── Holdings ───
  if (p.holdings.length > 0) {
    doc.setTextColor(...primary)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('持仓明细', 15, y)
    y += 6

    const holdingRows = p.holdings.map((h: HoldingSummary) => [
      h.fund_name,
      h.currency,
      h.total_shares.toLocaleString(),
      h.cost_basis.toFixed(4),
      h.current_nav.toFixed(4),
      `${h.currency} ${formatCurrency(h.current_value)}`,
      formatPercent(h.return_rate),
    ])

    autoTable(doc, {
      startY: y,
      head: [['基金名称', '币种', '份额', '成本净值', '当前净值', '当前市值', '收益率']],
      body: holdingRows,
      headStyles: { fillColor: primary, textColor: [255, 255, 255], fontSize: 9 },
      styles: { fontSize: 8.5, cellPadding: 3 },
      alternateRowStyles: { fillColor: lightGray },
      theme: 'striped',
      margin: { left: 15, right: 15 },
    })

    y = (doc as any).lastAutoTable.finalY + 10
  }

  // ─── Recent Transactions ───
  if (data.transactions.length > 0) {
    if (y > 240) {
      doc.addPage()
      y = 20
    }

    doc.setTextColor(...primary)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('近期交易记录', 15, y)
    y += 6

    const txRows = data.transactions.slice(0, 15).map(tx => [
      formatDate(tx.created_at),
      tx.type === 'subscribe' ? '认购' : tx.type === 'redeem' ? '赎回' : '分红',
      tx.fund?.name || '-',
      tx.fund?.currency || '',
      formatCurrency(tx.amount),
      tx.shares.toLocaleString(),
      tx.status === 'completed' ? '已完成' : tx.status === 'pending' ? '待审批' : tx.status === 'approved' ? '已批准' : '已拒绝',
    ])

    autoTable(doc, {
      startY: y,
      head: [['日期', '类型', '基金', '币种', '金额', '份额', '状态']],
      body: txRows,
      headStyles: { fillColor: primary, textColor: [255, 255, 255], fontSize: 9 },
      styles: { fontSize: 8.5, cellPadding: 3 },
      alternateRowStyles: { fillColor: lightGray },
      theme: 'striped',
      margin: { left: 15, right: 15 },
    })

    y = (doc as any).lastAutoTable.finalY + 10
  }

  // ─── Disclaimer ───
  if (y > 260) {
    doc.addPage()
    y = 20
  }

  doc.setFontSize(7.5)
  doc.setTextColor(...textGray)
  doc.setFont('helvetica', 'italic')
  const disclaimer = '免责声明：本对账单仅供参考，数据以基金管理人官方记录为准。过往业绩不代表未来收益。投资有风险，入市须谨慎。'
  const splitText = doc.splitTextToSize(disclaimer, pageW - 30)
  doc.text(splitText, 15, y)

  // ─── Footer ───
  const totalPages = doc.internal.pages.length - 1
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(...textGray)
    doc.text('SkyW Capital | 天汇投资基金管理有限公司', 15, 290)
    doc.text(`第 ${i} / ${totalPages} 页`, pageW - 15, 290, { align: 'right' })
  }

  // ─── Save ───
  const fileName = `statement_${lpName.replace(/\s/g, '_')}_${genDate.replace(/\//g, '-')}.pdf`
  doc.save(fileName)
}
