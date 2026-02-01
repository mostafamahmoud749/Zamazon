import { Suspense } from 'react';
import SignClient from '@/components/auth/SignClient';
import {JSX} from "react"


export default function SignPage():JSX.Element {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignClient />
    </Suspense>
  );
}
