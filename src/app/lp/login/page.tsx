'use client'

/**
 * 天汇基金 LP Portal - 登录页
 * 深海蓝金融风格设计
 *
 * @module app/lp/login/page
 * @created 2026-02-18
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, Mail, Lock, ArrowRight, TrendingUp, Shield, Globe, AlertCircle } from 'lucide-react'

/**
 * 金融图形水印 SVG 组件
 */
const FinancialWatermark = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03]" preserveAspectRatio="none">
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
      </pattern>
      <pattern id="chart" width="100" height="100" patternUnits="userSpaceOnUse">
        <polyline
          points="0,80 20,70 40,75 60,50 80,55 100,30"
          fill="none"
          stroke="white"
          strokeWidth="1"
        />
        <polyline
          points="0,90 25,85 50,60 75,65 100,40"
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          opacity="0.5"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
    <rect width="100%" height="100%" fill="url(#chart)" />
  </svg>
)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * 处理登录表单提交
   * 调用 NextAuth signIn，成功后跳转到 Dashboard
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('请输入电子邮件')
      return
    }
    if (!password) {
      setError('请输入密码')
      return
    }

    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error === 'CredentialsSignin'
          ? '邮箱或密码错误，请重试'
          : result.error
        )
        setLoading(false)
        return
      }

      if (result?.ok) {
        // 登录成功后根据角色跳转
        // 先获取session来确定角色
        const response = await fetch('/api/auth/session')
        const session = await response.json()

        if (session?.user?.role === 'admin' || session?.user?.role === 'fund_manager') {
          router.push('/lp-admin')
        } else {
          router.push('/lp')
        }
        router.refresh()
      }
    } catch (err) {
      setError('登录失败，请检查网络连接后重试')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* 左侧品牌区 - 深海蓝渐变 */}
      <div
        className="lg:w-1/2 relative overflow-hidden min-h-[300px] lg:min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #0A2342 0%, #144272 50%, #0A2342 100%)',
        }}
      >
        <FinancialWatermark />

        {/* 光效装饰 */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(44,116,179,0.2) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex flex-col justify-center px-8 lg:px-16 py-12 h-full">
          {/* Logo + System Status */}
          <div className="mb-8 animate-fade-in">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: '#10B981' }}
              />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>System Online</span>
            </div>
          </div>

          {/* 主标题 */}
          <div className="animate-fade-in-delay-1">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-2xl"
                style={{ boxShadow: '0 8px 32px rgba(212,175,55,0.3)' }}
              >
                <img src="/logo.png" alt="SkyW Logo" className="w-12 h-12 object-contain" />
              </div>
              <div>
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #E8C756 50%, #D4AF37 100%)',
                    WebkitBackgroundClip: 'text',
                  }}
                >
                  SkyW
                </span>
                <br />
                <span className="text-white">Capital</span>
              </div>
            </h1>
          </div>

          <p className="mt-4 text-lg lg:text-xl" style={{ color: 'rgba(255,255,255,0.7)' }}>
            天匯投資基金管理有限公司
          </p>
          <p
            className="mt-6 leading-relaxed max-w-md"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Professional private equity fund management platform delivering transparent, efficient, and secure investment experiences.
          </p>

          {/* Stats - 金色数字 */}
          <div className="mt-10 grid grid-cols-3 gap-6 animate-fade-in-delay-2">
            <div className="group">
              <div className="flex items-center gap-2 mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">AUM</span>
              </div>
              <p
                className="text-2xl lg:text-3xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #E8C756 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ¥500M+
              </p>
            </div>
            <div className="group">
              <div className="flex items-center gap-2 mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <Shield className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">LPs</span>
              </div>
              <p
                className="text-2xl lg:text-3xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #E8C756 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                50+
              </p>
            </div>
            <div className="group">
              <div className="flex items-center gap-2 mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <Globe className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">IRR</span>
              </div>
              <p
                className="text-2xl lg:text-3xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #E8C756 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                15%+
              </p>
            </div>
          </div>

          {/* Bottom badges */}
          <div className="mt-auto pt-8 flex flex-wrap gap-4 animate-fade-in-delay-3">
            <div
              className="px-3 py-1.5 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>HK SFC Licensed</span>
            </div>
            <div
              className="px-3 py-1.5 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>ISO 27001</span>
            </div>
            <div
              className="px-3 py-1.5 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Bank-level Security</span>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧登录区 - 毛玻璃卡片 */}
      <div
        className="flex-1 flex items-center justify-center px-6 lg:px-8 py-12 relative overflow-hidden"
        style={{ background: '#F8FAFC' }}
      >
        {/* 背景装饰 */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-2xl"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-2xl"
          style={{ background: 'radial-gradient(circle, rgba(44,116,179,0.1) 0%, transparent 70%)' }}
        />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center flex items-center justify-center gap-3">
            <div
              className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg overflow-hidden"
            >
              <img src="/logo.png" alt="SkyW Logo" className="w-8 h-8 object-contain" />
            </div>
            <h1 className="text-2xl font-bold">
              <span
                className="text-transparent bg-clip-text"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #E8C756 100%)',
                  WebkitBackgroundClip: 'text',
                }}
              >
                SkyW
              </span>
              <span style={{ color: '#1E293B' }}> Capital</span>
            </h1>
          </div>

          {/* 毛玻璃登录卡片 */}
          <div
            className="glass rounded-2xl p-8"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
          >
            <div className="mb-8">
              <h2
                className="text-2xl font-bold"
                style={{ color: '#1E293B' }}
              >
                歡迎回來
              </h2>
              <p className="mt-2" style={{ color: '#64748B' }}>
                登入您的投資人入口網站
              </p>
            </div>

            {/* 错误提示 */}
            {error && (
              <div
                className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl text-sm animate-fade-in"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#EF4444'
                }}
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#334155' }}
                >
                  電子郵件
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors"
                    style={{ color: '#94A3B8' }}
                  />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError(null)
                    }}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl transition-all outline-none"
                    style={{
                      background: '#F1F5F9',
                      border: '1px solid #E2E8F0',
                      color: '#1E293B',
                    }}
                    placeholder="investor@example.com"
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#334155' }}
                >
                  密碼
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors"
                    style={{ color: '#94A3B8' }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (error) setError(null)
                    }}
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl transition-all outline-none"
                    style={{
                      background: '#F1F5F9',
                      border: '1px solid #E2E8F0',
                      color: '#1E293B',
                    }}
                    placeholder="••••••••"
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#94A3B8' }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded"
                    style={{ accentColor: '#D4AF37' }}
                  />
                  <span className="ml-2.5 text-sm" style={{ color: '#475569' }}>記住我</span>
                </label>
                <a
                  href="#"
                  className="text-sm font-medium transition-colors"
                  style={{ color: '#D4AF37' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#B8962F'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#D4AF37'}
                >
                  忘記密碼？
                </a>
              </div>

              {/* 金色渐变登录按钮 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #E8C756 50%, #D4AF37 100%)',
                  boxShadow: '0 4px 16px rgba(212,175,55,0.3)',
                  color: '#0A2342',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(212,175,55,0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,175,55,0.3)'
                }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    登入
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6" style={{ borderTop: '1px solid #E2E8F0' }}>
              <p className="text-center text-sm" style={{ color: '#64748B' }}>
                還沒有帳戶？{' '}
                <a
                  href="#"
                  className="font-medium transition-colors"
                  style={{ color: '#D4AF37' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#B8962F'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#D4AF37'}
                >
                  聯繫基金管理人
                </a>
              </p>
            </div>

            {/* Security badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs" style={{ color: '#94A3B8' }}>
              <Shield className="w-4 h-4" />
              <span>256-bit SSL Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
