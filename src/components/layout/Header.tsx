import Link from 'next/link';
import { Film, Search, Sparkles } from 'lucide-react';
import SearchBar from '@/components/SearchBar';

export default function Header() {
  return (
    <header className="bg-background sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-primary hover:opacity-80 transition-opacity">
          <Film size={32} />
          <span className="text-2xl font-bold">FlickPick</span>
        </Link>
        <div className="flex items-center space-x-4 md:space-x-6">
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/recommendations" className="text-foreground hover:text-primary transition-colors flex items-center">
              <Sparkles size={18} className="mr-1" />
              Recommendations
            </Link>
          </nav>
          <SearchBar />
          {/* Mobile Menu Trigger (optional, for future enhancement) */}
        </div>
      </div>
    </header>
  );
}
