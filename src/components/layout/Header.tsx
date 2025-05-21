
'use client';

import Link from 'next/link';
import { Film, Search, Sparkles, ChevronDown, Menu } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React, { Suspense } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

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

const categories = [
  { name: "American", query: "American cinema" },
  { name: "Australian", query: "Australian cinema" },
  { name: "British", query: "British cinema" },
  { name: "Canadian", query: "Canadian cinema" },
  { name: "Chinese", query: "Chinese cinema" },
  { name: "European", query: "European cinema" },
  { name: "Filipino", query: "Filipino cinema" },
  { name: "French", query: "French cinema" },
  { name: "German", query: "German cinema" },
  { name: "Indian", query: "Indian cinema" },
  { name: "Italian", query: "Italian cinema" },
  { name: "Japanese", query: "Japanese cinema" },
  { name: "Korean", query: "Korean cinema" },
  { name: "Spanish", query: "Spanish cinema" },
  { name: "Thai", query: "Thai cinema" },
];

function SearchBarFallback() {
  return (
    <form className="flex items-center space-x-2 relative">
      <Input
        type="text"
        placeholder="Search movies & TV shows..."
        className="h-9 w-40 md:w-64 bg-input text-foreground placeholder-muted-foreground border-border pr-8"
        disabled
      />
      <Button type="submit" variant="primary" size="icon" className="h-9 w-9 shrink-0" disabled>
        <Search size={18} />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}

export default function Header() {
  return (
    <header className="bg-background sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-primary hover:opacity-80 transition-opacity">
          <Film size={32} />
          <span className="text-2xl font-bold">FlickPick</span>
        </Link>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Desktop Navigation */}
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="text-foreground hover:text-primary transition-colors px-2 lg:px-3">
                  Categories <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover text-popover-foreground w-56">
                <ScrollArea className="h-72">
                  {categories.sort((a, b) => a.name.localeCompare(b.name)).map((category) => (
                    <DropdownMenuItem key={category.name} asChild>
                      <Link href={`/search?q=${encodeURIComponent(category.query)}`} className="hover:bg-accent hover:text-accent-foreground">
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="link" asChild className="text-foreground hover:text-primary transition-colors px-2 lg:px-3">
              <Link href="/recommendations" className="flex items-center">
                <Sparkles size={18} className="mr-1" />
                Recommendations
              </Link>
            </Button>
          </nav>

          <Suspense fallback={<SearchBarFallback />}>
            <SearchBar />
          </Suspense>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-background p-0">
                <SheetHeader className="p-4 border-b border-border">
                  <SheetTitle>
                    <SheetClose asChild>
                      <Link href="/" className="flex items-center space-x-2 text-primary hover:opacity-80 transition-opacity">
                        <Film size={28} />
                        <span className="text-xl font-bold">FlickPick</span>
                      </Link>
                    </SheetClose>
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-65px)]"> {/* Adjust height based on header */}
                  <nav className="flex flex-col space-y-2 p-4">
                    <SheetClose asChild>
                      <Link href="/" className="block px-3 py-2 text-base rounded-md hover:bg-accent hover:text-primary">Home</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/movies" className="block px-3 py-2 text-base rounded-md hover:bg-accent hover:text-primary">Movies</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/tv-shows" className="block px-3 py-2 text-base rounded-md hover:bg-accent hover:text-primary">TV Shows</Link>
                    </SheetClose>

                    <div className="pt-2">
                      <p className="px-3 py-1 text-sm font-semibold text-muted-foreground">Genres</p>
                      {genres.map((genre) => (
                        <SheetClose asChild key={`mobile-${genre.name}`}>
                          <Link href={`/search?q=${encodeURIComponent(genre.query)}`} className="block px-3 py-2 text-base rounded-md hover:bg-accent hover:text-primary">
                            {genre.name}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>

                    <div className="pt-2">
                      <p className="px-3 py-1 text-sm font-semibold text-muted-foreground">Categories</p>
                      {categories.sort((a, b) => a.name.localeCompare(b.name)).map((category) => (
                        <SheetClose asChild key={`mobile-${category.name}`}>
                          <Link href={`/search?q=${encodeURIComponent(category.query)}`} className="block px-3 py-2 text-base rounded-md hover:bg-accent hover:text-primary">
                            {category.name}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                    
                    <SheetClose asChild>
                      <Link href="/recommendations" className="flex items-center px-3 py-2 text-base rounded-md hover:bg-accent hover:text-primary">
                        <Sparkles size={18} className="mr-2" />
                        Recommendations
                      </Link>
                    </SheetClose>
                  </nav>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
