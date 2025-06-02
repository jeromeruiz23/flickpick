
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script'; // Import the Script component
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'),
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
        <meta name="google-adsense-account" content="ca-pub-8352459973412570" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
        <Toaster />
        
        {/* Added highperformanceformat.com scripts */}
        <Script id="highperformanceformat-options" strategy="beforeInteractive">
          {`
            atOptions = {
              'key' : 'acc8252bf86645ad2a55e77225f49ddb',
              'format' : 'iframe',
              'height' : 90,
              'width' : 728,
              'params' : {}
            };
          `}
        </Script>
        <Script
          id="highperformanceformat-invoke"
          src="//www.highperformanceformat.com/acc8252bf86645ad2a55e77225f49ddb/invoke.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
