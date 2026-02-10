import { ReactNode } from 'react';

type CartSidebarItemProps = {
  children: ReactNode;
};
export default function CartSidebarItem({ children }: CartSidebarItemProps) {
  return (
    <div className="flex flex-col items-center border-b-1 border-b-gray-300 px-2 py-2">
      {children}
    </div>
  );
}
