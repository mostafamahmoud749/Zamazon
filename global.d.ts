declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.less';

declare global {
  namespace Express {
    interface User {
      id: string;
      email?: string;
      password?: string;
      name?: string | null;
      githubID?: string;
      userName?: string;
    }
  }
}

export {};
