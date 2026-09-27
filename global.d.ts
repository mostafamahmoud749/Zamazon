declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.less';

declare global {
  namespace Express {
    interface User {
      id: number;
      email?: string;
      password?: string;
      name?: string ;
      githubID?: number;
      userName?: string;
    }
  }
}

export {};
