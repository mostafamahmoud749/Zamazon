import UserDetails from '@/components/profile/UserDetails';
import AddressSection from '@/components/profile/AddressSection';
import PaymentSection from '@/components/profile/PaymentSection';

export default function ProfilePage() {

  return (
    <div className="text-dark my-8 flex w-full justify-center px-4">
      <div className="flex w-full max-w-2xl flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <UserDetails />
        <AddressSection />
        <PaymentSection />
        
      </div>
    </div>
  );
}
