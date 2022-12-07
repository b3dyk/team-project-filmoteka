import { Movies } from './fetch';
import { markupFilmoteka, getGenres, APIKey } from './markup';
import { addLoadingSpinner, removeLoadingSpinner } from './loading-spinner';
import clearFilmoteka from './clearFilmoteka';
import refs from './refs';
import { nextOptions } from './pagination';
import { showMore } from './pagination';

// *********************************************
import Pagination from 'tui-pagination';
import {
  paginationStart,
  updateMoviesList,
  makePaginationOptions,
} from './pagination';

// *********************************************

const movies = new Movies(APIKey);

let searchValue = 'cat';
const isHeaderMain = refs.header.classList.contains('header--home');
if (isHeaderMain) {
  refs.searchForm.addEventListener('submit', onSubmitForm);
}

function onSubmitForm(evt) {
  evt.preventDefault();
  nextOptions.nextPage = 1;

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
  try {
    const { results, total_results } = await movies.searchMovies(
      searchValue,
      page
    );

    await getPaginationBySearch(total_results);

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

async function getPaginationBySearch(total_results) {
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

async function getAppendSearchMovies(page) {
  try {
    const { results } = await movies.searchMovies(searchValue, page);

    if (results.length < 20) {
      showMore.hide();
    }

    markupFilmoteka(results);
  } catch (error) {
    console.log(error.name);
    console.log(error.message);
  }
}

function updateSearchList(event) {
  console.log('event.page -->', event.page);

  nextOptions.nextPage = event.page;
  console.log('nextPage in updateSearchList -->', nextOptions.nextPage);

  getAppendSearchMovies(event.page);
}
