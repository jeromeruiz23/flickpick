
import { getPopularTVShows, type ContentItem } from '@/lib/tmdb';
import ContentGrid from '@/components/ContentGrid';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Popular TV Shows - FlickPick',
  description: 'Browse the most popular TV shows currently trending.',
};

interface TVShowsPageProps {
  searchParams: { page?: string };
}

export default async function TVShowsPage({ searchParams }: TVShowsPageProps) {
  const currentPage = Number(searchParams.page) || 1;
  let popularTVShows: ContentItem[] = [];
  let totalPages = 1;
  let errorOccurred = false;

  try {
    const tvShowsData = await getPopularTVShows(currentPage);
    popularTVShows = tvShowsData.results;
    totalPages = tvShowsData.total_pages;
  } catch (error) {
    console.error("Failed to load popular TV shows:", error);
    errorOccurred = true;
  }

  return (
    <div className="space-y-12">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 border-l-4 border-primary pl-4">
        Popular TV Shows
      </h1>
      {errorOccurred ? (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold mb-4">Could Not Load TV Shows</h2>
          <p className="text-muted-foreground">There was an issue fetching popular TV shows. Please try again later.</p>
        </div>
      ) : popularTVShows.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">No popular TV shows found.</p>
        </div>
      ) : (
        <>
          <ContentGrid items={popularTVShows} />
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-12">
              <Link
                href={`/tv-shows?page=${currentPage - 1}`}
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
                href={`/tv-shows?page=${currentPage + 1}`}
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
      )}
    </div>
  );
}
