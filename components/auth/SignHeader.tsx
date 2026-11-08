import Logo from '@/components/common/Logo';

export default function SignHeader() {
  return (
    <header className="bg-dark_blue p-2 text-white md:my-6 md:bg-white md:text-center md:text-black">
      <Logo className="md:text-3xl" />
    </header>
  );
}
