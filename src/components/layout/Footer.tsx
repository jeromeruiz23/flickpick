export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-8 text-center">
      <div className="container mx-auto px-4">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} FlickPick. All rights reserved.
        </p>
        <p className="text-muted-foreground text-xs mt-1">
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
