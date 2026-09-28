declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.less';

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string | null;
      password: string | null;
      name: string | null;
      createdAt: Date;
      updatedAt: Date;
    }
  }
}

export {};
