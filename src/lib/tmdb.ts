'use server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

if (!TMDB_API_KEY) {
  console.warn(
    "Warning: TMDB_API_KEY environment variable is not set. Please ensure it's defined in your .env file."
  );
}

interface VideoResult {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}

interface MediaVideos {
  results: VideoResult[];
}

interface ExternalIds {
  imdb_id?: string | null;
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
  external_ids?: ExternalIds;
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
    throw new Error("TMDB_API_KEY is missing. Please check your .env file.");
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
      next: { revalidate: 3600 }
    }); 
    if (!response.ok) {
      throw new Error(`Failed to fetch data from TMDB: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`TMDB error fetching ${url}:`, error);
    throw error;
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

export async function getTrendingAllWeek(page: number = 1): Promise<TMDBListResponse<ContentItem>> {
  return fetchTMDB<TMDBListResponse<ContentItem>>('trending/all/week', { page: page.toString() });
}

export async function searchContent(query: string, page: number = 1): Promise<TMDBListResponse<ContentItem>> {
  const data = await fetchTMDB<TMDBListResponse<any>>('search/multi', { query, page: page.toString(), include_adult: 'false' });
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

export async function getMovieRecommendations(id: number, page: number = 1): Promise<TMDBListResponse<Movie>> {
  const data = await fetchTMDB<TMDBListResponse<Movie>>(`movie/${id}/recommendations`, { page: page.toString() });
  return {
    ...data,
    results: data.results.map(item => ({ ...item, media_type: 'movie' }))
  };
}

export async function getTVShowRecommendations(id: number, page: number = 1): Promise<TMDBListResponse<TVShow>> {
  const data = await fetchTMDB<TMDBListResponse<TVShow>>(`tv/${id}/recommendations`, { page: page.toString() });
  return {
    ...data,
    results: data.results.map(item => ({ ...item, media_type: 'tv' }))
  };
}
