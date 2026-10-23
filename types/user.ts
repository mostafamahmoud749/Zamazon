import type { User } from '@/schemas/User.schema';

export type UserContextValue = {
  user: User | null;
  status: 'loading' | 'authenticated' | 'unauthenticated' | 'error';
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};
