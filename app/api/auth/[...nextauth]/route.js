import NextAuth from 'next-auth';
import { providers } from '@/lib/nextAuth';

export const authOptions = {
  providers,
  pages: {
    signIn: '/signin',
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
