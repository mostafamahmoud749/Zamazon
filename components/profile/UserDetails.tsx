'use client';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function UserDetails() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState('/profile-avatar.svg');

  useEffect(() => {
    if (!selectedFile) return;

    const previewUrl = URL.createObjectURL(selectedFile);
    setImageSrc(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedFile]);

  return (
    <div className="flex flex-col items-center border-b border-gray-200 pb-8 text-center">
      <div className="relative">
        <Image
          src={imageSrc}
          alt="profile picture"
          width={112}
          height={112}
          className="size-28 rounded-full border-4 border-white object-cover shadow-md"
          priority
        />
        <input
          id="profile-photo"
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) setSelectedFile(file);
          }}
          accept="image/*"
          className="peer sr-only"
        />
        <label
          htmlFor="profile-photo"
          title="Choose profile photo"
          className="peer-focus-visible:outline-dark_blue absolute right-0 bottom-0 flex size-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-slate-900 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2"
        >
          <Camera size={15} aria-hidden="true" />
        </label>
      </div>
      <h1 className="mt-4 text-2xl font-semibold">Mostafa Ahmed</h1>
      <p className="mt-1 text-sm text-slate-500">mostafa@example.com</p>
    </div>
  );
}
