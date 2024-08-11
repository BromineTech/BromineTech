import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Bromine',
  description: 'Project management app for all',
  icons: {
    icon: '/favicon.ico', // Path to your favicon
  },
  openGraph: {
    title: 'Bromine waitlist',
    description: 'minimalist linear clone',
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
      <body className={`${inter.className} h-[50rem] w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative`}>
        <nav className="w-full h-18 flex justify-between py-4 px-6">
        <h1 className="text-3xl bg-gradient-to-br from-gray-400 via-white via-50% to-black text-transparent bg-clip-text font-bold text-left relative">bromine</h1>
        </nav>
        {children}
        </body>
    </html>
  );
}
