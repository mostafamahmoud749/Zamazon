import { Check } from 'lucide-react';
import Button from '@/components/common/Button';

type CancelOrderButtonProps = {
  isCanceled: boolean;
  isConfirming: boolean;
  isCanceling: boolean;
  onCancel: () => Promise<void>;
  onConfirm: () => void;
  onKeepOrder: () => void;
};

export default function CancelOrderButton({
  isCanceled,
  isConfirming,
  isCanceling,
  onCancel,
  onConfirm,
  onKeepOrder,
}: CancelOrderButtonProps) {
  return (
    <div className="border-t border-gray-100 bg-gray-50 px-5 py-5 sm:px-6">
      {isCanceled ? (
        <p className="flex items-center gap-2 text-sm text-gray-600">
          <Check size={16} aria-hidden="true" />
          Order canceled
        </p>
      ) : (
        <>
          <h3 className="text-sm font-medium">
            {isConfirming ? 'Cancel this order?' : 'Changed your mind?'}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-gray-500">
            {isConfirming
              ? 'Confirm that you want to cancel this order.'
              : 'You can cancel your order while its status is pending.'}
          </p>
          {isConfirming ? (
            <div className="mt-4 space-y-2">
              <Button
                onClick={onCancel}
                loading={isCanceling}
                loadingText="Canceling order…"
                className="focus-visible:outline-dark_blue w-full cursor-pointer rounded-full bg-red-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Confirm cancellation
              </Button>
              <Button
                onClick={onKeepOrder}
                disabled={isCanceling}
                className="focus-visible:outline-dark_blue w-full cursor-pointer rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Keep my order
              </Button>
            </div>
          ) : (
            <Button
              onClick={onConfirm}
              className="focus-visible:outline-dark_blue mt-4 w-full cursor-pointer rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Cancel order
            </Button>
          )}
        </>
      )}
    </div>
  );
}
