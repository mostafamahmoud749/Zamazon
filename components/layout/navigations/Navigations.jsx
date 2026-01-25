import Link from 'next/link';

export default function Navigations({ my, H, navs = [], toggle }) {
  const showNavs = navs.map((el) => (
    <Link
      key={el.key}
      onClick={toggle}
      href={`/deals?filters=${encodeURIComponent(JSON.stringify(el))}`}
      className={`${my ? 'my-4 ' : ''} block pl-4 text-sm ${H ? 'flex-shrink-0 first:pl-0' : 'w-full'}`}
    >
      {el.key}
    </Link>
  ));

  return (
    <div
      className={` p-1 ${
        H ? 'scrollbar-hide flex gap-3 overflow-x-auto scroll-smooth' : ''
      }`}
    >
      <Link
        href="/deals"
        className={`${my ? 'my-4 ' : ''} block pl-4 text-sm ${H ? 'flex-shrink-0 first:pl-0' : 'w-full'}`}
      >
        Today's Deals
      </Link>
      {showNavs}
    </div>
  );
}
