import type { Metadata } from 'next';
import { Playfair_Display, Cormorant_Garamond, Noto_Serif_SC } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

const noto = Noto_Serif_SC({
  subsets: ['chinese-simplified'],
  weight: ['400', '700'],
  variable: '--font-noto',
});

export const metadata: Metadata = {
  title: '婚礼邀请函 | Wedding Invitation 2026',
  description: 'You are cordially invited to our wedding on 2026.11.14 at Ascott Gurney Penang.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className={`${playfair.variable} ${cormorant.variable} ${noto.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
