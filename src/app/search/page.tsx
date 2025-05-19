
import { searchContent, type ContentItem } from '@/lib/tmdb';
import ContentGrid from '@/components/ContentGrid';
import { Suspense } from 'react';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SearchPageProps {
  searchParams: { q?: string; page?: string };
}

async function SearchResults({ query, currentPage }: { query: string; currentPage: number }) {
  let searchResults: ContentItem[] = [];
  let totalPages = 1;
  let errorOccurred = false;

  if (query) {
    try {
      const data = await searchContent(query, currentPage);
      searchResults = data.results;
      totalPages = data.total_pages;
    } catch (error) {
      console.error("Failed to search content:", error);
      errorOccurred = true;
    }
  }

  if (errorOccurred) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-4">Search Error</h2>
        <p className="text-muted-foreground">Could not perform search. Please try again later.</p>
      </div>
    );
  }

  if (!query) {
     return (
      <div className="text-center py-10">
        <p className="text-lg text-muted-foreground">Please enter a search term to find movies and TV shows.</p>
      </div>
     );
  }
  
  if (searchResults.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-muted-foreground">No results found for "{query}".</p>
      </div>
    );
  }

  return (
    <>
      <ContentGrid items={searchResults} />
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-12">
          <Link
            href={`/search?q=${encodeURIComponent(query)}&page=${currentPage - 1}`}
            passHref
            legacyBehavior
          >
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              className={cn(currentPage <= 1 && "opacity-50 cursor-not-allowed")}
              aria-label="Previous page"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          </Link>
          <span className="text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Link
            href={`/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}`}
            passHref
            legacyBehavior
          >
            <Button
              variant="outline"
              disabled={currentPage >= totalPages}
              className={cn(currentPage >= totalPages && "opacity-50 cursor-not-allowed")}
              aria-label="Next page"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const currentPage = Number(searchParams.page) || 1;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Search Results {query && <span className="text-primary">for "{query}"</span>}
        {!query && <span className="text-foreground">Explore</span>}
      </h1>
      <Suspense fallback={<SearchPageLoading query={query} />}>
        <SearchResults query={query} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}

function SearchPageLoading({ query }: { query: string}) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      {query ? 
        <p className="text-muted-foreground text-lg">Searching for "{query}"...</p> : 
        <p className="text-muted-foreground text-lg">Loading search...</p>
      }
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mt-8 w-full">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="aspect-[2/3] bg-muted rounded-md animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}
