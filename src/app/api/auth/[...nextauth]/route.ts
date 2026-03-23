import NextAuth from 'next-auth'
import { lpAuthOptions } from '@/lib/lp-auth-options'

const handler = NextAuth(lpAuthOptions)
export { handler as GET, handler as POST }
