'use client'

import { Bell, Calendar, ChevronRight, AlertCircle } from 'lucide-react'

// 模拟数据
const announcements = [
  {
    id: '1',
    title: '2026年1月基金净值公告',
    content: '尊敬的投资人，天汇成长基金一期2026年1月31日单位净值为1.2345元，较上月增长0.54%。基金运行平稳，投资策略持续有效。感谢您的信任与支持。',
    date: '2026-02-01',
    isImportant: true,
    isRead: false,
  },
  {
    id: '2',
    title: '年度投资者会议通知',
    content: '天汇基金2025年度投资者会议定于2026年3月15日下午2:00在深圳南山区科技园天汇大厦举行，届时将汇报2025年度投资情况及2026年投资策略。敬请各位投资人拨冗出席。',
    date: '2026-01-20',
    isImportant: true,
    isRead: true,
  },
  {
    id: '3',
    title: '投资策略调整说明',
    content: '根据市场环境变化，基金管理团队对部分投资组合进行了优化调整，增加了科技板块配置比例。此次调整旨在把握科技创新发展机遇，提升投资收益。',
    date: '2026-01-10',
    isImportant: false,
    isRead: true,
  },
  {
    id: '4',
    title: '2025年12月基金月报发布',
    content: '2025年12月基金月报已上传至文档中心，请各位投资人登录系统查阅。如有任何问题，请随时联系基金管理人。',
    date: '2026-01-05',
    isImportant: false,
    isRead: true,
  },
  {
    id: '5',
    title: '系统升级通知',
    content: '为提升服务体验，投资人门户系统将于2026年1月3日凌晨进行升级维护，届时系统将暂停服务约2小时，给您带来的不便敬请谅解。',
    date: '2025-12-28',
    isImportant: false,
    isRead: true,
  },
]

export default function AnnouncementsPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">公告通知</h1>
          <p className="mt-1 text-slate-500">查看基金最新公告和重要通知</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Bell className="h-4 w-4" />
          <span>共 {announcements.length} 条公告</span>
        </div>
      </div>

      {/* Important Notice */}
      <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">重要公告</p>
            <p className="text-sm text-amber-700 mt-1">
              有 {announcements.filter((a) => a.isImportant && !a.isRead).length} 条重要公告未读，请及时查看
            </p>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((item) => (
          <div
            key={item.id}
            className={`rounded-xl bg-white p-6 shadow-sm border cursor-pointer transition hover:shadow-md ${
              item.isImportant ? 'border-l-4 border-l-red-500 border-t border-r border-b border-slate-100' : 'border-slate-100'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  {item.isImportant && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded">
                      重要
                    </span>
                  )}
                  {!item.isRead && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                </div>
                <p className="mt-2 text-slate-600 line-clamp-2">{item.content}</p>
                <div className="mt-3 flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {item.date}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
