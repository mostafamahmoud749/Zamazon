'use client';

import AuthSection from '@/components/auth/AuthSection';
import RegisterForm from '@/components/auth/RegisterForm';
import LoginForm from '@/components/auth/LoginForm';
import Popup from '@/components/common/Popup';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SignClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const S: string | null = searchParams.get('s');
  const callbackUrl: string = searchParams.get('callbackUrl') || '/';

  const [newUser, setNewUser] = useState<boolean>(S === 'signin' ? false : true);
  const [popup, setPopup] = useState<{ success: boolean; message: string } | null>(null);

  function toggle(selected: boolean): void {
    if (!selected) {
      const next = !newUser;
      setNewUser(next);
      router.push(`/sign?s=${next ? 'signup' : 'signin'}`);
    }
  }

  useEffect(() => {
    setNewUser(S === 'signin' ? false : true);
  }, [S]);

  useEffect(() => {
    if (!popup) return;
    const timeout = setTimeout(() => setPopup(null), 8000);
    return () => clearTimeout(timeout);
  }, [popup]);

  return (
    <main className="m-auto w-full max-w-[400px] rounded-md border-1 border-gray-200 bg-white shadow-sm md:mt-6">
      {popup && (
        <Popup success={popup.success} message={popup.message} onClose={() => setPopup(null)} />
      )}
      <AuthSection selected={newUser} toggle={toggle} text="Create account" textq="New to Zamazon?">
        <RegisterForm onResult={setPopup} />
      </AuthSection>

      <AuthSection selected={!newUser} toggle={toggle} text="Sign in" textq="Already a customer?">
        <LoginForm onResult={setPopup} callbackUrl={callbackUrl} />
      </AuthSection>
    </main>
  );
}
