import { Movies } from './fetch';
import { markupFilmoteka } from './markup';
import { addLoadingSpinner, removeLoadingSpinner } from './loading-spinner';
import clearFilmoteka from './clearFilmoteka';
import { initSearchPagination } from './pagination';
import refs from './refs';
import { APIKey } from './apikey';

const isHeaderMain = refs.header.classList.contains('header--home');
if (isHeaderMain) {
  refs.searchForm.addEventListener('submit', onSubmitForm);
}

async function onSubmitForm(evt) {
  evt.preventDefault();
  const searchValue = evt.currentTarget.elements.searchQuery.value;

  const totalResults = await initSearchMoviesList(searchValue);
  console.log('totalResults ', totalResults);

  initSearchPagination(totalResults);
}

// Оновлення списку результатів пошуку
export async function initSearchMoviesList(query, page) {
  addLoadingSpinner();

  const totalResults = await getSearchMovies(query, page);

  removeLoadingSpinner();

  return totalResults;
}

async function getSearchMovies(query, page = 1) {
  const movies = new Movies(APIKey);

  try {
    const { results, total_results } = await movies.searchMovies(query, page);

    if (results.length === 0) {
      // throw new Error(
      //   'Sorry, there are no movies matching your search query. Please try again.'
      // );
      onInvalidSearchQuery();
      return null;
    }

    clearFilmoteka();

    markupFilmoteka(results);

    return total_results;
  } catch (error) {
    console.log(error.message);
  }
}

function onInvalidSearchQuery() {
  const notification = document.querySelector('#message');

  notification.classList.remove('is-hidden');

  const removeNotification = () => {
    setTimeout(() => {
      notification.classList.add('is-hidden');
    }, 3000);
  };

  removeNotification();
}
