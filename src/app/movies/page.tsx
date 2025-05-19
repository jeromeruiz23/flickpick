'use client';

import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import ContentGrid from '@/components/ContentGrid';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ContentItem, Movie } from '@/lib/tmdb'; // Adjusted to import ContentItem as well for the grid

interface TMDBListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'An unknown error occurred during fetch.' }));
    throw new Error(errorData.message || `An error occurred: ${res.statusText}`);
  }
  return res.json();
};

export default function MoviesPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data: moviesResponse, error, isLoading } = useSWR<TMDBListResponse<Movie>>(
    `/api/movies/popular?page=${currentPage}`,
    fetcher
  );

  const popularMovies: ContentItem[] = moviesResponse?.results?.map(movie => ({ ...movie, media_type: 'movie' })) || [];
  const totalPages = moviesResponse?.total_pages || 1;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-lg">Loading popular movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-4">Could Not Load Movies</h2>
        <p className="text-muted-foreground">
          There was an issue fetching popular movies: {error.message}. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 border-l-4 border-primary pl-4">
        Popular Movies
      </h1>
      {popularMovies.length === 0 && !isLoading ? ( // Added !isLoading check to avoid brief "No movies" flash
         <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">No popular movies found.</p>
        </div>
      ) : (
        <>
          <ContentGrid items={popularMovies} />
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-12">
              <Link
                href={`/movies?page=${currentPage - 1}`}
                passHref
                legacyBehavior // Maintained legacyBehavior as in original file
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
                href={`/movies?page=${currentPage + 1}`}
                passHref
                legacyBehavior // Maintained legacyBehavior as in original file
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
      )}
    </div>
  );
}
