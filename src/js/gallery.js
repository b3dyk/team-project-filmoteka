import { addLoadingSpinner, removeLoadingSpinner } from './loading-spinner';
import { Movies } from './fetch';
import clearFilmoteka from './clearFilmoteka';
import { markupFilmoteka } from './markup';
import { APIKey } from './apikey';

// Page from pagination
export async function initTrendMoviesList(page) {
  addLoadingSpinner();

  const totalResults = await getTrendMovies(page);

  removeLoadingSpinner();

  return totalResults;
}

async function getTrendMovies(page) {
  const movies = new Movies(APIKey);

  try {
    const { results, total_results } = await movies.getTrendingMovies(page);

    if (results.length === 0) {
      throw new Error(
        'Sorry, there are no movies matching your search query. Please try again.'
      );
    }

    clearFilmoteka();

    markupFilmoteka(results);

    return total_results;
  } catch (error) {
    console.log(error.message);
  }
}
