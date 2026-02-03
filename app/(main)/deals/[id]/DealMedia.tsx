import DesktopDeal from '@/components/deal/DesktopDeal';
import MobileDeal from '@/components/deal/MobileDeal';
import type { Product } from '@/types/index';


type DealMediaProps = {
  userAgent?: string;
  product: Product;
};

export default function DealMedia({ userAgent, product }: DealMediaProps) {
  const isMobile: boolean = /Mobi|Android/i.test(userAgent ?? '');
  return isMobile ? <MobileDeal product={product} /> : <DesktopDeal product={product} />;
}
