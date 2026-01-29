import Link from 'next/link';
import Button from '@/components/common/Button';

export default function SignLink() {
  return (
    <div className="my-2 text-center">
      <Link href="/signin" className="m-auto mb-1 block w-40">
        <Button color="bg-yellow" hoverdColor="hover:bg-yellow-400">
          sign in
        </Button>
      </Link>
      <div className="text-xs">
        New customer?
        <Link href="/sign?s=signup" className="text-sky-700 underline hover:text-sky-900">
          Start here
        </Link>
      </div>
    </div>
  );
}
