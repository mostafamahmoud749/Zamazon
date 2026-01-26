import { Suspense } from 'react';
import SignClient from '@/components/auth/SignClient';

export default function SignPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignClient />
    </Suspense>
  );
}
