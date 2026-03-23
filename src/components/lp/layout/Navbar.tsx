'use client'

/**
 * 导航栏 + 侧边栏组件
 * 深海蓝金融风格 - 金色高亮
 * 支持折叠功能
 *
 * @module components/lp/layout/Navbar
 * @created 2026-02-18
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  FileText,
  Upload,
  Bell,
  Menu,
  X,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'

const navItems = [
  { href: '/lp', label: 'Dashboard', labelZh: '儀表板', icon: LayoutDashboard },
  { href: '/lp/holdings', label: 'Holdings', labelZh: '我的份額', icon: FolderOpen },
  { href: '/lp/transactions', label: 'Transactions', labelZh: '申購/贖回', icon: FileText },
  { href: '/lp/documents', label: 'Documents', labelZh: '文檔中心', icon: Upload },
  { href: '/lp/announcements', label: 'Announcements', labelZh: '公告', icon: Bell },
]

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // 初始化：从 localStorage 读取折叠状态
  useEffect(() => {
    setIsMounted(true)
    const saved = localStorage.getItem('sidebarCollapsed')
    if (saved !== null) {
      setCollapsed(saved === 'true')
    } else {
      // 桌面端默认展开，移动端默认折叠
      setCollapsed(false)
    }
  }, [])

  // 同步折叠状态到 CSS 变量
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--sidebar-width', collapsed ? '5rem' : '18rem')
    }
  }, [collapsed])

  // 监听窗口大小，自动折叠移动端
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setCollapsed(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 切换折叠状态
  const toggleSidebar = () => {
    const newState = !collapsed
    setCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', String(newState))
  }

  // 移动端切换
  const toggleMobile = () => {
    setMobileOpen(!mobileOpen)
  }

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const sidebarWidth = collapsed ? 'w-20' : 'w-72'
  const contentMargin = isMounted ? (collapsed ? 'md:ml-20' : 'md:ml-72') : 'md:ml-72'

  return (
    <>
      {/* 移動端頂部欄 */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-50"
        style={{
          background: 'linear-gradient(135deg, #0A2342 0%, #144272 100%)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-lg overflow-hidden"
            style={{ boxShadow: '0 4px 12px rgba(212,175,55,0.3)' }}
          >
            <img src="/logo.png" alt="SkyW Logo" className="w-6 h-6 object-contain" />
          </div>
          <span className="font-bold text-white">
            <span style={{ color: '#D4AF37' }}>SkyW</span>
            <span className="text-white"> Capital</span>
          </span>
        </div>
        <button
          onClick={toggleMobile}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'rgba(255,255,255,0.8)' }}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* 移動端遮罩 */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* 側邊欄 - 深海蓝背景 */}
      <aside
        className={`fixed top-0 left-0 h-full transition-all duration-300 z-40
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 ${sidebarWidth}`}
        style={{
          background: 'linear-gradient(180deg, #0A2342 0%, #0D1F38 100%)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* Logo & Collapse Button */}
        <div
          className="h-16 flex items-center px-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
            <div
              className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0"
              style={{ boxShadow: '0 4px 16px rgba(212,175,55,0.3)' }}
            >
              <img src="/logo.png" alt="SkyW Logo" className="w-8 h-8 object-contain" />
            </div>
            {!collapsed && (
              <div>
                <p className="font-bold text-lg text-white">
                  <span style={{ color: '#D4AF37' }}>SkyW</span>
                  <span className="text-white"> Capital</span>
                </p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Investor Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Collapse Toggle Button - 桌面端 */}
        <button
          onClick={toggleSidebar}
          className="hidden md:flex absolute -right-3 top-20 w-6 h-6 bg-white rounded-full shadow-lg items-center justify-center text-slate-600 hover:text-slate-900 transition-colors z-50"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Navigation - 金色高亮 */}
        <nav className="mt-6 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 mb-1.5 transition-all group relative ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-300 hover:text-white'
                } ${collapsed ? 'justify-center px-3' : ''}`}
                style={isActive ? {
                  background: 'linear-gradient(90deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)',
                } : {
                  background: 'transparent',
                }}
              >
                {/* 金色左边框 - 当前页 */}
                {isActive && !collapsed && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 rounded-r-full"
                    style={{ background: 'linear-gradient(180deg, #D4AF37 0%, #E8C756 100%)' }}
                  />
                )}

                <Icon
                  className={`h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-[#D4AF37]' : 'text-slate-400 group-hover:text-white'}`}
                />
                {!collapsed && (
                  <div className="flex-1">
                    <p className="font-medium">{item.label}</p>
                    <p className={`text-xs transition-colors ${isActive ? 'text-[#D4AF37]/70' : 'text-slate-500 group-hover:text-slate-400'}`}>
                      {item.labelZh}
                    </p>
                  </div>
                )}

                {/* 悬停背景 */}
                {!isActive && (
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className={`flex items-center gap-3 px-2 ${collapsed ? 'justify-center' : ''}`}>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #B8962F 100%)',
                boxShadow: '0 4px 12px rgba(212,175,55,0.3)'
              }}
            >
              {(session?.user?.name || 'U').slice(0, 2)}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-white truncate">{session?.user?.name || session?.user?.email}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>LP Investor</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={() => signOut({ callbackUrl: '/lp/login' })}
                className="p-2 rounded-lg transition-colors hover:bg-white/10"
                title="退出登录"
              >
                <LogOut className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
            )}
          </div>
          {collapsed && (
            <button
              onClick={() => signOut({ callbackUrl: '/lp/login' })}
              className="w-full mt-2 p-2 rounded-lg transition-colors hover:bg-white/10 flex justify-center"
              title="退出登录"
            >
              <LogOut className="w-4 h-4 text-slate-400 hover:text-white" />
            </button>
          )}
        </div>
      </aside>

      {/* 移動端底部佔位 */}
      <div className="md:hidden h-16" />
    </>
  )
}
