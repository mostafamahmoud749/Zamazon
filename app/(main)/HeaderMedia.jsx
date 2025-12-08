import MobileHeader from '@/components/layout/headers/MobileHeader';
import DesktopHeader from '@/components/layout/headers/DesktopHeader';
export default function HeaderMedia({ userAgent, navs }) {
  const isMobile = /Mobi|Android/i.test(userAgent);
  return isMobile ? <MobileHeader navs={navs} /> : <DesktopHeader navs={navs} />;
}
