import NextAuth, { type NextAuthOptions } from 'next-auth';
import { providers } from '@/lib/nextAuth';

export const authOptions: NextAuthOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign?s=signin',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
