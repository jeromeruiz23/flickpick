
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

// Debounce function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
}

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  // Update query state if the URL changes (e.g., browser back/forward)
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const performSearch = useCallback((currentQuery: string) => {
    if (currentQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(currentQuery.trim())}`);
    } else {
      // If the query is empty, navigate to the search page without a query param
      // or to a different page, depending on desired behavior.
      // For now, let's keep it on the search page so it can show "Please enter a search term"
      router.push(`/search`);
    }
  }, [router]);

  const debouncedSearch = useCallback(debounce(performSearch, 500), [performSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performSearch(query); // Perform search immediately on submit
  };

  const clearSearch = () => {
    setQuery('');
    router.push('/search');
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex items-center space-x-2 relative">
      <Input
        type="text"
        placeholder="Search movies & TV shows..."
        value={query}
        onChange={handleInputChange}
        className="h-9 w-40 md:w-64 bg-input text-foreground placeholder-muted-foreground border-border focus:ring-primary pr-8"
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 absolute right-12 md:right-12 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={clearSearch}
        >
          <X size={16} />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
      <Button type="submit" variant="primary" size="icon" className="h-9 w-9 shrink-0">
        <Search size={18} />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}
