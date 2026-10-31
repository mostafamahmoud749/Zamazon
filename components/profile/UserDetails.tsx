import Image from 'next/image';

export default function UserDetails() {
  return (
    <div className="flex flex-col items-center border-b border-gray-200 pb-8 text-center">
      <Image
        src="/profile-avatar.svg"
        alt="profile picture"
        width={112}
        height={112}
        className="rounded-full border-4 border-white object-cover shadow-md"
        priority
      />
      <h1 className="mt-4 text-2xl font-semibold">Mostafa Ahmed</h1>
      <p className="mt-1 text-sm text-slate-500">mostafa@example.com</p>
    </div>
  );
}
