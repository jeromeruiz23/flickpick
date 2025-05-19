import { NextRequest, NextResponse } from 'next/server';
import { getPopularMovies } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page');
  const currentPage = Number(page) || 1;

  try {
    const moviesData = await getPopularMovies(currentPage);
    return NextResponse.json(moviesData);
  } catch (error) {
    console.error("API route /api/movies/popular error:", error);
    // Ensure error is an instance of Error before accessing message property
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to fetch popular movies', error: errorMessage }, { status: 500 });
  }
}
