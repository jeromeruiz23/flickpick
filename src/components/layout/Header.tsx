import Link from 'next/link';
import { Film, Search, Sparkles, ChevronDown } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const genres = [
  { name: "Action", query: "Action" },
  { name: "Comedy", query: "Comedy" },
  { name: "Drama", query: "Drama" },
  { name: "Sci-Fi", query: "Science Fiction" },
  { name: "Horror", query: "Horror" },
  { name: "Romance", query: "Romance" },
  { name: "Animation", query: "Animation" },
  { name: "Documentary", query: "Documentary" },
];

export default function Header() {
  return (
    <header className="bg-background sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-primary hover:opacity-80 transition-opacity">
          <Film size={32} />
          <span className="text-2xl font-bold">FlickPick</span>
        </Link>
        <div className="flex items-center space-x-2 md:space-x-4">
          <nav className="hidden md:flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            <Button variant="link" asChild className="text-foreground hover:text-primary transition-colors px-2 lg:px-3">
              <Link href="/">Home</Link>
            </Button>
            <Button variant="link" asChild className="text-foreground hover:text-primary transition-colors px-2 lg:px-3">
              <Link href="/movies">Movies</Link>
            </Button>
            <Button variant="link" asChild className="text-foreground hover:text-primary transition-colors px-2 lg:px-3">
              <Link href="/tv-shows">TV Shows</Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="text-foreground hover:text-primary transition-colors px-2 lg:px-3">
                  Genres <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover text-popover-foreground">
                {genres.map((genre) => (
                  <DropdownMenuItem key={genre.name} asChild>
                    <Link href={`/search?q=${encodeURIComponent(genre.query)}`} className="hover:bg-accent hover:text-accent-foreground">
                      {genre.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="link" asChild className="text-foreground hover:text-primary transition-colors px-2 lg:px-3">
              <Link href="/recommendations" className="flex items-center">
                <Sparkles size={18} className="mr-1" />
                Recommendations
              </Link>
            </Button>
          </nav>
          <SearchBar />
          {/* Mobile Menu Trigger (optional, for future enhancement for smaller screens) */}
        </div>
      </div>
    </header>
  );
}
