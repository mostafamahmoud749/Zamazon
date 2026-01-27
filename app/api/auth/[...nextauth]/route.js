import NextAuth from 'next-auth';
import { providers } from '@/lib/nextAuth';

export const authOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign?s=signin',
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
