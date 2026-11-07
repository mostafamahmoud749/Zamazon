'use client';
import Button from '@/components/common/Button';
import Image from 'next/image';
import { Camera, LoaderCircle, X } from 'lucide-react';
import { useEffect, useState, useContext, useRef } from 'react';
import { UserContext } from '@/components/auth/UserProvider';
import Popup from '@/components/common/Popup';
import { uploadImage } from '@/lib/uploadImage';
import { getCsrfToken } from '@/lib/getCsrfToken';

export default function UserDetails() {
  const { user, refreshUser } = useContext(UserContext);
  const photoDialogRef = useRef<HTMLDialogElement>(null);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [popup, setPopup] = useState<{ success: boolean; message: string } | null>(null);
  const photoSrc = user?.image ?? '/profile-avatar.svg';

  useEffect(() => {
    const dialog = photoDialogRef.current;
    if (!isPhotoOpen || !dialog) return;

    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [isPhotoOpen]);

  useEffect(() => {
    if (!popup) return;
    const timeout = setTimeout(() => setPopup(null), 8000);
    return () => clearTimeout(timeout);
  }, [popup]);

  async function updatePhoto(file: File) {
    if (isUploading) return;
    setIsUploading(true);
    setPopup(null);

    try {
      const { url } = await uploadImage(file);
      const csrfToken = await getCsrfToken();

      const result = await fetch('/api/users/me/image', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ image: url }),
      });

      if (!result.ok) {
        const data = await result.json().catch(() => null);
        const messages: Record<number, string> = {
          401: 'Please sign in to update your profile photo.',
          403: 'Your session could not be verified. Please refresh and try again.',
        };
        throw new Error(
          messages[result.status] ||
            (typeof data?.error === 'string' ? data.error : null) ||
            'Could not save your profile photo. Please try again.',
        );
      }

      await refreshUser();
      setPopup({ success: true, message: 'Profile photo updated successfully.' });
    } catch (error) {
      setPopup({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Could not update your profile photo. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center border-b border-gray-200 pb-8 text-center">
      {popup && (
        <Popup success={popup.success} message={popup.message} onClose={() => setPopup(null)} />
      )}
      <dialog
        ref={photoDialogRef}
        onClose={() => setIsPhotoOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsPhotoOpen(false);
        }}
        className="m-auto max-h-none max-w-none overflow-visible rounded-2xl border-0 bg-transparent p-0 shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      >
        <h2 className="sr-only">Profile photo</h2>
        <div className="relative aspect-square w-[min(85vw,40rem,80dvh)] overflow-hidden rounded-2xl bg-slate-950">
          <Image
            src={photoSrc}
            alt="Enlarged profile photo"
            fill
            sizes="(max-width: 752px) 85vw, 640px"
            className="object-contain"
          />
          <Button
            type="button"
            onClick={() => setIsPhotoOpen(false)}
            className="absolute top-3 right-3 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X size={22} aria-hidden="true" />
          </Button>
        </div>
      </dialog>
      <div className="relative">
        <Button
          type="button"
          aria-haspopup="dialog"
          onClick={() => setIsPhotoOpen(true)}
          className="focus-visible:outline-dark_blue block cursor-zoom-in rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Image
            src={photoSrc}
            alt="profile picture"
            width={112}
            height={112}
            className="size-28 rounded-full border-4 border-white object-cover shadow-md"
            priority
          />
        </Button>
        <input
          id="profile-photo"
          type="file"
          disabled={isUploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (file) void updatePhoto(file);
          }}
          accept="image/jpeg,image/png,image/webp"
          className="peer sr-only"
        />
        <label
          htmlFor="profile-photo"
          title={isUploading ? 'Uploading profile photo...' : 'Choose profile photo'}
          aria-disabled={isUploading}
          className="peer-focus-visible:outline-dark_blue absolute right-0 bottom-0 flex size-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-slate-600 shadow-sm transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-60 hover:bg-gray-50 hover:text-slate-900"
        >
          {isUploading ? (
            <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />
          ) : (
            <Camera size={15} aria-hidden="true" />
          )}
        </label>
      </div>
      {isUploading && (
        <p role="status" className="mt-2 text-sm text-slate-500">
          Uploading photo...
        </p>
      )}
      <h1 className="mt-4 text-2xl font-semibold">{user?.name ?? 'user'}</h1>
      <p className="mt-1 text-sm text-slate-500">{user?.email ?? ''}</p>
    </div>
  );
}
