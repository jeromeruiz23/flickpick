import { getPopularTVShows, type ContentItem } from '@/lib/tmdb';
import ContentGrid from '@/components/ContentGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Popular TV Shows - FlickPick',
  description: 'Browse the most popular TV shows currently trending.',
};

export default async function TVShowsPage() {
  let popularTVShows: ContentItem[] = [];
  let errorOccurred = false;

  try {
    const tvShowsData = await getPopularTVShows();
    popularTVShows = tvShowsData.results;
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
      ) : (
        <ContentGrid items={popularTVShows} />
      )}
    </div>
  );
}
