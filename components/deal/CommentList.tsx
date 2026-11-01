import Stars from '@/components/deal/Stars';
import CommentItem from '@/components/deal/CommentItem';
export default function CommentList() {
  return (
    <div className="divide-y divide-gray-300 lg:col-span-2">
      <CommentItem
        name={'Nour Ali'}
        rating={4}
        date={'October 23, 2026'}
        comment={
          'Good quality for the price. The packaging could have been better, but everything arrivedin good condition.'
        }
      />
      <CommentItem
        name={'Nour Ali'}
        rating={4}
        date={'October 23, 2026'}
        comment={
          'Good quality for the price. The packaging could have been better, but everything arrivedin good condition.'
        }
      />
    </div>
  );
}
