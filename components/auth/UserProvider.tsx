'use client';
import { createContext, useCallback, useEffect, useState } from 'react';
import type { UserContextValue } from '@/types';
import type { ReactNode } from 'react';
import type { User } from '@/schemas/User.schema';
import { UserSchema } from '@/schemas/User.schema';

const defaultUserContextValue: UserContextValue = {
  user: null,
  status: 'loading',
  refreshUser: async () => {},
  logout: async () => {},
};

const UserContext = createContext<UserContextValue>(defaultUserContextValue);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<UserContextValue['status']>('loading');

  const refreshUser = useCallback(async function () {
    setStatus('loading');

    try {
      const result = await fetch(`${process.env.API_URL}/api/users/me`, {
        credentials: 'include',
      });

      if (result.status === 401) {
        setUser(null);
        setStatus('unauthenticated');
        return;
      }

      if (!result.ok) {
        throw new Error('Failed to fetch user');
      }

      const user = UserSchema.parse(await result.json());

      setUser(user);
      setStatus('authenticated');
    } catch (err) {
      setStatus('error');
    }
  }, []);

  async function logout() {
    setUser(null);
    setStatus('unauthenticated');
  }

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  return (
    <UserContext.Provider value={{ user, status, refreshUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}
