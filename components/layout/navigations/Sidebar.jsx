import { X } from 'lucide-react';

export default function Sidebar({ header, main, toggle, open, border }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black transition-opacity duration-500 ${
          open ? 'pointer-events-auto opacity-80' : 'pointer-events-none opacity-0'
        }`}
        onClick={toggle}
      ></div>
      <nav
        className={`fixed z-50  h-full w-4/5 max-w-md bg-white transition-all duration-300 ease-in-out ${
          open ? 'top-0 left-0' : 'top-0 -left-full'
        }`}
      >
        <div
          className={`absolute top-4 -right-12 p-1 ${border ? ' rounded-md border-2 border-white' : ''}`}
        >
          <X className={`h-8 w-8 cursor-pointer`} onClick={toggle} />
        </div>
        <header className="bg-dark_blue p-4 text-white">{header}</header>

        <main className="text-black">{main}</main>
      </nav>
    </>
  );
}
