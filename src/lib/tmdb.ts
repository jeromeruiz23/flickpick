
'use server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Ensure this is set in your .env file
if (!TMDB_API_KEY) {
  console.warn(
    "Warning: TMDB_API_KEY environment variable is not set. Please ensure it's defined in your .env file and the server has been restarted. Some features may not work."
  );
}

interface VideoResult {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string; // YouTube key
  name: string;
  official: boolean;
  published_at: string;
  site: string; // e.g., "YouTube"
  size: number;
  type: string; // e.g., "Trailer", "Teaser"
}

interface MediaVideos {
  results: VideoResult[];
}

interface ExternalIds {
  imdb_id?: string | null;
  // Add other external IDs here if needed in the future
  // facebook_id?: string | null;
  // instagram_id?: string | null;
  // twitter_id?: string | null;
}

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres?: { id: number; name: string }[];
  media_type?: 'movie';
  tagline?: string;
  runtime?: number;
  videos?: MediaVideos;
  external_ids?: ExternalIds;
}

export interface Season {
  id: number;
  name: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string | null;
  overview?: string; 
}

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres?: { id: number; name: string }[];
  media_type?: 'tv';
  tagline?: string;
  number_of_seasons?: number;
  seasons?: Season[];
  videos?: MediaVideos;
  external_ids?: ExternalIds; // Though not used by GoDrivePlayer for TV, keep for consistency
}

export type ContentItem = Movie | TVShow;

interface TMDBListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY is not configured. Please ensure it is set in your .env file and that you have restarted your development server. It appears to be missing, which will prevent TMDB API calls from working.");
  }
  
  const headers: HeadersInit = {
    'Authorization': `Bearer ${TMDB_API_KEY}`,
    'Accept': 'application/json',
  };

  const urlParams = new URLSearchParams({
    language: 'en-US',
    ...params,
  });
  const url = `${TMDB_BASE_URL}/${endpoint}?${urlParams.toString()}`;
  
  try {
    const response = await fetch(url, { 
      headers,
      next: { revalidate: 3600 } // Revalidate data every hour
    }); 
    if (!response.ok) {
      console.error(`Error fetching ${url}: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error("Error body:", errorBody);
      throw new Error(`Failed to fetch data from TMDB: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Network error or JSON parsing error fetching ${url}:`, error);
    if (error instanceof Error) {
        throw new Error(`TMDB API request failed: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching from TMDB.');
  }
}

export async function getPopularMovies(page: number = 1): Promise<TMDBListResponse<Movie>> {
  const data = await fetchTMDB<TMDBListResponse<Movie>>('movie/popular', { page: page.toString() });
  return {
    ...data,
    results: data.results.map(item => ({ ...item, media_type: 'movie' }))
  };
}

export async function getPopularTVShows(page: number = 1): Promise<TMDBListResponse<TVShow>> {
  const data = await fetchTMDB<TMDBListResponse<TVShow>>('tv/popular', { page: page.toString() });
   return {
    ...data,
    results: data.results.map(item => ({ ...item, media_type: 'tv' }))
  };
}

export async function getTopRatedMovies(page: number = 1): Promise<TMDBListResponse<Movie>> {
  const data = await fetchTMDB<TMDBListResponse<Movie>>('movie/top_rated', { page: page.toString() });
  return {
    ...data,
    results: data.results.map(item => ({ ...item, media_type: 'movie' }))
  };
}

export async function getTrendingAllWeek(page: number = 1): Promise<TMDBListResponse<ContentItem>> {
  return fetchTMDB<TMDBListResponse<ContentItem>>('trending/all/week', { page: page.toString() });
}

export async function searchContent(query: string, page: number = 1): Promise<TMDBListResponse<ContentItem>> {
  const data = await fetchTMDB<TMDBListResponse<any>>('search/multi', { query, page: page.toString(), include_adult: 'false' });
  // Filter out persons or other non-movie/tv media types
  return {
    ...data,
    results: data.results.filter(item => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path)
  };
}

export async function getMovieDetails(id: number): Promise<Movie> {
  const movie = await fetchTMDB<Movie>(`movie/${id}?append_to_response=videos,external_ids`);
  return { ...movie, media_type: 'movie' };
}

export async function getTVShowDetails(id: number): Promise<TVShow> {
  const tvShow = await fetchTMDB<TVShow>(`tv/${id}?append_to_response=videos,external_ids`);
  return { ...tvShow, media_type: 'tv' };
}
