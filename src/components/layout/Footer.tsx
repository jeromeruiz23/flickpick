
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-8 text-center">
      <div className="container mx-auto px-4">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} FlickPick. All rights reserved.
        </p>
        <div className="mt-2 text-xs text-muted-foreground flex flex-wrap justify-center items-center space-x-2 sm:space-x-4">
          <Link href="/faqs" className="hover:text-primary transition-colors">
            FAQs
          </Link>
          <span>|</span>
          <Link href="/policy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
        </div>
        <p className="text-muted-foreground text-xs mt-2">
          Movie and TV show data provided by{' '}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            TMDB
          </a>.
        </p>
      </div>
    </footer>
  );
}
