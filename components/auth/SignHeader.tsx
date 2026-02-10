import Link from 'next/link';

export default function SignHeader() {
  return (
    <header className="bg-dark_blue p-2 text-white md:my-6 md:bg-white md:text-center md:text-black">
      <Link href="/" className="text-xl font-bold md:text-3xl">
        Zamazon
      </Link>
    </header>
  );
}
