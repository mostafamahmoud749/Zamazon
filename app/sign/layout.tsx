import SignHeader from '@/components/auth/SignHeader';
import { ReactNode, JSX } from 'react';
export default function SignLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <>
      <SignHeader />
      <main className="m-auto w-11/12">
        <div className="m-auto my-4 max-w-[400px] text-xl font-bold md:hidden">Welcome</div>
        {children}
      </main>
    </>
  );
}
