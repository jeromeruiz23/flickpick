
import { getPopularMovies, getPopularTVShows, getTrendingAllWeek, type ContentItem, getMovieDetails, getTVShowDetails } from '@/lib/tmdb';
import ContentGrid from '@/components/ContentGrid';
import HeroSection from '@/components/HeroSection';
import ContentSlider from '@/components/ContentSlider';

export default async function HomePage() {
  let popularMovies: ContentItem[] = [];
  let popularTVShows: ContentItem[] = [];
  let trendingItems: ContentItem[] = [];
  let heroItemsList: ContentItem[] = [];

  try {
    const [moviesData, tvShowsData, trendingData] = await Promise.all([
      getPopularMovies(),
      getPopularTVShows(),
      getTrendingAllWeek()
    ]);
    popularMovies = moviesData.results;
    popularTVShows = tvShowsData.results;
    trendingItems = trendingData.results;

    if (trendingItems.length > 0) {
      const topTrendingItemsBase = trendingItems.slice(0, 5); // Use top 5 trending items for hero banner
      // Fetch full details for hero items to get video data
      const heroItemsPromises = topTrendingItemsBase.map(async (item) => {
        try {
          if (item.media_type === 'movie' && item.id) {
            return await getMovieDetails(item.id);
          } else if (item.media_type === 'tv' && item.id) {
            return await getTVShowDetails(item.id);
          }
        } catch (detailError) {
          console.error(`Failed to fetch details for hero item ${item.id} (${item.media_type}):`, detailError);
          // Return the base item if details fetch fails, so it can still display an image
          return item;
        }
        return item; // Fallback for items without a known media_type or ID (shouldn't happen with TMDB)
      });
      heroItemsList = (await Promise.all(heroItemsPromises)).filter(item => item !== null) as ContentItem[];

    } else if (popularMovies.length > 0) {
       // Fallback to first popular movie if no trending, fetch its details too
      const firstPopularMovie = popularMovies[0];
      if (firstPopularMovie && firstPopularMovie.id) {
        try {
            heroItemsList = [await getMovieDetails(firstPopularMovie.id)];
        } catch (detailError) {
            console.error(`Failed to fetch details for fallback hero item ${firstPopularMovie.id}:`, detailError);
            heroItemsList = [firstPopularMovie]; // Use base item on error
        }
      }
    }

  } catch (error) {
    console.error("Failed to load data for homepage:", error);
    // Data will remain empty, and components will handle their empty states.
  }

  return (
    <div className="space-y-12">
      <HeroSection items={heroItemsList} />
      
      {trendingItems.length > 0 && <ContentSlider items={trendingItems} title="Featured Recommendations" />}
      
      {trendingItems.length > 0 && <ContentGrid items={trendingItems} title="Trending This Week" />}
      {popularMovies.length > 0 && <ContentGrid items={popularMovies} title="Popular Movies" />}
      {popularTVShows.length > 0 && <ContentGrid items={popularTVShows} title="Popular TV Shows" />}
      
      {(popularMovies.length === 0 && popularTVShows.length === 0 && trendingItems.length === 0 && heroItemsList.length === 0) && (
         <div className="text-center py-10">
           <h2 className="text-2xl font-semibold mb-4">Could Not Load Content</h2>
           <p className="text-muted-foreground">There was an issue fetching movies and TV shows. Please try again later.</p>
         </div>
      )}
    </div>
  );
}
