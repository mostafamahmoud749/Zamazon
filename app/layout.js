import { Inter } from 'next/font/google';
import './globals.css';

const amazonFont = Inter({
  variable: '--font-amazon-sans',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Zamazon',
  description: 'Amazon-style store built with Next.js + Tailwind',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={amazonFont.variable}>
      <body className="bg-gray-100 text-black">{children}</body>
    </html>
  );
}
