import Logo from '@/components/common/Logo';

export default function MainFooter() {
  return (
    <footer className=" bg-dark_blue text-white">
      <div className="w-full border-t border-blue-900" />
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-between gap-4 px-4 py-4 md:flex-row">
          <Logo />
        <div className="mb-2 flex gap-4 md:mb-0">
          <a
            href="https://github.com/mostafamahmoud749"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-orange-400"
            aria-label="GitHub"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.76.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 2.92-.39c.99 0 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
            </svg>
          </a>
          <a
            href="mailto:mostafamahmoud749@gmail.com"
            className="transition hover:text-orange-400"
            aria-label="Email"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm-16 12V8.99l7.88 6.99c.36.32.88.32 1.24 0L20 8.99V18H4z" />
            </svg>
          </a>
        </div>
        <div className="text-center text-xs text-gray-400 md:text-right">
          Made with <span className="text-orange-400">♥</span> by Mostafa &copy;{' '}
          {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
