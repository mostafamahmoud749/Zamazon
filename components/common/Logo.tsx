import Link from 'next/link';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Zamazon home"
      className={`inline-flex shrink-0 items-center text-xl font-bold ${className}`}
    >
      <span className="relative inline-block pb-[0.65em] leading-none">
        zamazon
        <svg
          viewBox="0 0 100 34"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute bottom-0 left-[14%] h-[0.75em] w-[70%] text-[#ff9900]"
          fill="currentColor"
        >
          <path d="M 92 5 C 70 23 35 26 12 8 C 28 36 69 37 94 10 C 97 7 96 3 92 5 Z" />
          <path d="M 6 7 C 10 3 23 2 30 6 C 21 6 17 8 14 11 C 10 15 9 22 9 25 C 6 19 5 12 6 7 Z" />
        </svg>
      </span>
    </Link>
  );
}
