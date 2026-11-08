import { Suspense } from 'react';
import SignClient from '@/components/auth/SignClient';
import { JSX } from 'react';
import SignSkeleton from '@/components/loading/SignSkeleton';

export default function SignPage(): JSX.Element {
  return (
    <Suspense fallback={<SignSkeleton />}>
      <SignClient />
    </Suspense>
  );
}
