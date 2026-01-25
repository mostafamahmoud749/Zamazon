import DesktopDeal from "@/components/deal/DesktopDeal";
import MobileDeal from "@/components/deal/MobileDeal";

export default function DealMedia({ userAgent , product }) {
  const isMobile = /Mobi|Android/i.test(userAgent);
  return isMobile ? <MobileDeal product={product}/> : <DesktopDeal product={product}/>;
}
