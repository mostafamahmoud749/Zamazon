import DUserNav from '@/components/layout/user/DUserNav';
import type { Session } from 'next-auth';

type HSidebarDesktopProps={
  session: Session | null;
}
export default function HSidebarDesktop({session}:HSidebarDesktopProps) {
  return (
    <>
      <DUserNav big={true} session={session} />
    </>
  );
}
