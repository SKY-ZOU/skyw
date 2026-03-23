import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { findUserByEmail, verifyPassword } from '@/lib/lp-auth'
import type { UserRole } from '@/lib/lp-db-types'

export const lpAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: '邮箱密码登录',
      credentials: {
        email: { label: '邮箱', type: 'email' },
        password: { label: '密码', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('请输入邮箱和密码')
        }
        const user = await findUserByEmail(credentials.email)
        if (!user) throw new Error('用户不存在或密码错误')
        const isValid = await verifyPassword(credentials.password, user.password_hash)
        if (!isValid) throw new Error('用户不存在或密码错误')
        return { id: user.id, email: user.email, name: user.name || user.email, role: user.role }
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60, updateAge: 24 * 60 * 60 },
  jwt: { maxAge: 7 * 24 * 60 * 60 },
  pages: { signIn: '/lp/login', error: '/lp/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: UserRole }).role
        token.email = user.email || ''
        token.name = user.name || user.email || ''
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Role-based redirect after login
      return url.startsWith(baseUrl) ? url : baseUrl
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(lpAuthOptions)
