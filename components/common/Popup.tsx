'use client';
import { Check, CircleAlert, X } from 'lucide-react';
import Button from '@/components/common/Button';

type PopupProps = {
  success: boolean;
  message: string;
  onClose: () => void;
};

export default function Popup({ success, message, onClose }: PopupProps) {
  return (
    <div
      role={success ? 'status' : 'alert'}
      className="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 shadow-xl shadow-slate-900/10 sm:bottom-8"
    >
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
          success ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
        }`}
      >
        {success ? <Check size={18} /> : <CircleAlert size={18} />}
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm font-semibold">
          {success ? 'Success' : 'Unable to complete request'}
        </p>
        <p className="mt-1 text-sm leading-relaxed break-words text-gray-600">{message}</p>
      </div>
      <Button
        type="button"
        title="Dismiss notification"
        className="-mt-1 -mr-1 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
        onClick={onClose}
      >
        <X size={16} />
      </Button>
    </div>
  );
}
