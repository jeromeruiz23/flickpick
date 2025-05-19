import { searchContent, type ContentItem } from '@/lib/tmdb';
import ContentGrid from '@/components/ContentGrid';
import { Suspense } from 'react';

interface SearchPageProps {
  searchParams: { q?: string };
}

async function SearchResults({ query }: { query: string }) {
  let searchResults: ContentItem[] = [];
  let errorOccurred = false;

  if (query) {
    try {
      const data = await searchContent(query);
      searchResults = data.results;
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
     return <p className="text-muted-foreground">Please enter a search term to find movies and TV shows.</p>;
  }
  
  if (searchResults.length === 0) {
    return <p className="text-muted-foreground">No results found for "{query}".</p>;
  }

  return <ContentGrid items={searchResults} />;
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Search Results {query && <span className="text-primary">for "{query}"</span>}
      </h1>
      <Suspense fallback={<SearchPageLoading query={query} />}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}

function SearchPageLoading({ query }: { query: string}) {
  return (
    <div>
      {query ? <p className="text-muted-foreground">Searching for "{query}"...</p> : <p className="text-muted-foreground">Loading search...</p>}
      {/* You could add Skeleton components here for a better loading experience */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mt-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="aspect-[2/3] bg-muted rounded-md animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}
