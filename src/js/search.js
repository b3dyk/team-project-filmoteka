import { Movies } from './fetch';
import { markupFilmoteka, getGenres, APIKey } from './markup';
import { addLoadingSpinner, removeLoadingSpinner } from './loading-spinner';
import clearFilmoteka from './clearFilmoteka';
import refs from './refs';

// *********************************************
import Pagination from 'tui-pagination';
import {
  paginationStart,
  updateMoviesList,
  makePaginationOptions,
} from './pagination';

// *********************************************

let searchValue = 'cat';

refs.searchForm.addEventListener('submit', onSubmitForm);

function onSubmitForm(evt) {
  evt.preventDefault();
  searchValue = evt.currentTarget.elements.searchQuery.value;
  clearFilmoteka();
  addLoadingSpinner();

  Start();
}

async function Start() {
  await getGenres();

  await getMovies1();

  removeLoadingSpinner();
}

async function getMovies1(page) {
  const movies = new Movies(APIKey);

  try {
    const { results, total_results } = await movies.searchMovies(
      searchValue,
      page
    );

    paginTest(total_results);

    if (results.length === 0) {
      // throw new Error(
      //   'Sorry, there are no movies matching your search query. Please try again.'
      // );
      onInvalidSearchQuery();
      return;
    }

    clearFilmoteka();

    markupFilmoteka(results);
  } catch (error) {
    console.log(error.name);
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

// ************************************************

function paginTest(total_results) {
  const paginationOptions = makePaginationOptions(total_results);

  paginationStart.off('afterMove', updateMoviesList);

  const paginationBySearch = new Pagination(
    refs.paginationContainer,
    paginationOptions
  );

  paginationBySearch.on('afterMove', updateMoviesListBySearch);
}

async function updateMoviesListBySearch(event) {
  const currentPageBySearch = event.page;

  console.log('currentPageBySearch -->', currentPageBySearch);

  await getMovies1(currentPageBySearch);
}
