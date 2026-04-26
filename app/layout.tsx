import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Phonic Carbon — Pro DJ Station',
  description: 'Zintegrowana stacja robocza do zarządzania biblioteką muzyczną z analityką AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-zinc-950 text-zinc-100 antialiased selection:bg-cyan-500/30 overflow-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
