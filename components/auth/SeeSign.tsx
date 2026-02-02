import SignLink from '@/components/auth/SignLink';
import { JSX } from 'react';

export default function SeeSign(): JSX.Element {
  return (
    <div className="my-4 bg-white py-4">
      <div className="border-y-1 border-gray-300 bg-white py-4">
        <div className="mt-8 text-center text-2xl font-bold">See personalized recommendations</div>
        <SignLink />
      </div>
    </div>
  );
}
