import { Movies } from './fetch';
import { markupFilmoteka } from './markup';
import { addLoadingSpinner, removeLoadingSpinner } from './loading-spinner';
import clearFilmoteka from './clearFilmoteka';
import refs from './refs';
import { APIKey } from './apikey';

// const APIKey = 'e0e51fe83e5367383559a53110fae0e8';

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
  // await getGenres();

  await searchMovies(searchValue);

  removeLoadingSpinner();
}

// Page from pagination, query from LS
export async function searchMovies(query, page = 1) {
  const movies = new Movies(APIKey);

  try {
    const { results } = await movies.searchMovies(query, page);

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
