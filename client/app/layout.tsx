import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Bromine',
  description: 'Realtime and Minimalist Project management app for all',
  icons: {
    icon: '/favicon.ico', // Path to your favicon
  },
  openGraph: {
    title: 'Bromine waitlist',
    description: 'realtime and minimalist project management app',
    url: 'https://bromine.tech',
    siteName: 'Bromine',
    images: [
      {
        url: 'https://bromine.tech/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Our waitlist page',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* light and dark theme to be integrated */}
      <body className={`${inter.className} h-[100vh] overflow-hidden w-full relative`}>
        {children}
        </body>
    </html>
  );
}
