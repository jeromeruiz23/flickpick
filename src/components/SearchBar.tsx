'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery(''); // Optionally clear query after search
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="Search movies & TV shows..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-9 w-40 md:w-64 bg-input text-foreground placeholder-muted-foreground border-border focus:ring-primary"
      />
      <Button type="submit" variant="primary" size="icon" className="h-9 w-9 shrink-0">
        <Search size={18} />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}
