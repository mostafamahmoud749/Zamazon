'use client';

type PopupProps = {
  success: boolean;
  message: string;
  onClose: () => void;
};

export default function Popup({ success, message, onClose }: PopupProps) {
  return (
    <div
      role={success ? 'status' : 'alert'}
      className={`fixed bottom-8 left-1/2 z-50 flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-4 rounded-md border px-6 py-4 text-base font-medium text-white shadow-lg ${
        success ? 'border-green-800 bg-green-700' : 'border-red-800 bg-red-700'
      }`}
    >
      <span>{message}</span>
      <button type="button" aria-label="Dismiss notification" onClick={onClose}>
        ×
      </button>
    </div>
  );
}
