'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Users,
  FileText,
  Upload,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'

const navItems = [
  { href: '/lp-admin', label: 'Dashboard', labelZh: '控制台', icon: LayoutDashboard },
  { href: '/lp-admin/funds', label: 'Funds', labelZh: '基金產品', icon: Upload },
  { href: '/lp-admin/lps', label: 'Investors', labelZh: '投資人管理', icon: Users },
  { href: '/lp-admin/transactions', label: 'Transactions', labelZh: '交易審批', icon: FileText },
  { href: '/lp-admin/documents', label: 'Documents', labelZh: '文檔管理', icon: Upload },
  { href: '/lp-admin/settings', label: 'Settings', labelZh: '系統設置', icon: Settings },
]

export default function AdminNavbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // 初始化：从 localStorage 读取折叠状态
  useEffect(() => {
    setIsMounted(true)
    const saved = localStorage.getItem('adminSidebarCollapsed')
    if (saved !== null) {
      setCollapsed(saved === 'true')
    } else {
      setCollapsed(false)
    }
  }, [])

  // 监听窗口大小
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

  // 同步折叠状态到 CSS 变量
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--sidebar-width', collapsed ? '5rem' : '18rem')
    }
  }, [collapsed])

  // 切换折叠状态
  const toggleSidebar = () => {
    const newState = !collapsed
    setCollapsed(newState)
    localStorage.setItem('adminSidebarCollapsed', String(newState))
  }

  // 移动端切换
  const toggleMobile = () => {
    setMobileOpen(!mobileOpen)
  }

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const sidebarWidth = collapsed ? 'w-20' : 'w-72'

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between px-4 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="SkyW Logo" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <span className="font-bold text-sm">Admin Portal</span>
          </div>
        </div>
        <button
          onClick={toggleMobile}
          className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 z-40
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 ${sidebarWidth} shadow-2xl`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/10">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
              <img src="/logo.png" alt="SkyW Logo" className="w-8 h-8 object-contain" />
            </div>
            {!collapsed && (
              <div>
                <p className="font-bold text-lg">
                  <span className="text-blue-400">SkyW</span>
                  <span className="text-white"> Admin</span>
                </p>
                <p className="text-xs text-slate-400">Management Portal</p>
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

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 mb-1.5 transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                } ${collapsed ? 'justify-center px-3' : ''}`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                {!collapsed && (
                  <div className="flex-1">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-slate-400 group-hover:text-slate-300">{item.labelZh}</p>
                  </div>
                )}
                {isActive && !collapsed && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Admin Badge */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className={`flex items-center gap-3 px-2 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
              {(session?.user?.name || 'AD').slice(0, 2)}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{session?.user?.name || 'Admin'}</p>
                <p className="text-xs text-slate-400">Fund Manager</p>
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

      {/* Mobile Bottom Spacing */}
      <div className="md:hidden h-16" />
    </>
  )
}
