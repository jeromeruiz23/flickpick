
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'), // Change to your production URL
  title: 'FlickPick - Your Next Movie & TV Show Adventure!',
  description: 'Browse, search, and get personalized movie and TV show recommendations. Discover trending content, watch trailers, and find your next favorite flick.',
  keywords: ['movies', 'tv shows', 'recommendations', 'streaming', 'trailers', 'FlickPick', 'cinema', 'entertainment'],
  openGraph: {
    title: 'FlickPick - Your Next Movie & TV Show Adventure!',
    description: 'Discover your next favorite movie or TV show with FlickPick.',
    // Add a site logo URL here if you have one
    // images: ['/og-image.png'], 
  },
  // Add other metadata like twitter cards if desired
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8352459973412570"
     crossOrigin="anonymous"></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
