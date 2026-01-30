import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { PopupProvider } from '@/context/PopupContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Kridavista - Coming Soon',
  description: 'A premium virtual connection platform blending video rooms and interactive games to make distance irrelevant.',
  keywords: ['Virtual Connection', 'Video Rooms', 'Interactive Games', 'Kridavista'],
  authors: [{ name: 'Kridavista Team' }],
  openGraph: {
    title: 'Kridavista - Coming Soon',
    description: 'Join the waitlist for the future of virtual connection.',
    type: 'website',
    url: 'https://kridavista.com', // Placeholder URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <PopupProvider>
          {children}
        </PopupProvider>
      </body>
    </html>
  );
}
