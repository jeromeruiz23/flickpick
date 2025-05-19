import { getPopularMovies, type ContentItem } from '@/lib/tmdb';
import ContentGrid from '@/components/ContentGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Popular Movies - FlickPick',
  description: 'Browse the most popular movies currently trending.',
};

export default async function MoviesPage() {
  let popularMovies: ContentItem[] = [];
  let errorOccurred = false;

  try {
    const moviesData = await getPopularMovies();
    popularMovies = moviesData.results;
  } catch (error) {
    console.error("Failed to load popular movies:", error);
    errorOccurred = true;
  }

  return (
    <div className="space-y-12">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 border-l-4 border-primary pl-4">
        Popular Movies
      </h1>
      {errorOccurred ? (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold mb-4">Could Not Load Movies</h2>
          <p className="text-muted-foreground">There was an issue fetching popular movies. Please try again later.</p>
        </div>
      ) : (
        <ContentGrid items={popularMovies} />
      )}
    </div>
  );
}
