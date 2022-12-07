import { addLoadingSpinner, removeLoadingSpinner } from './loading-spinner';
import { Movies } from './fetch';
import clearFilmoteka from './clearFilmoteka';
import { markupFilmoteka, getGenres, APIKey } from './markup';
import ShowMore from './show-more-btn';
import refs from './refs';

const movies = new Movies(APIKey);
const showMore = new ShowMore({ selector: '.show-more', hidden: true });

let searchValue = 'cat';

refs.searchForm.addEventListener('submit', onSubmitForm);
function onSubmitForm(evt) {
  evt.preventDefault();
  searchValue = evt.currentTarget.elements.searchQuery.value;
  clearFilmoteka();
  Start();
}
Start();

async function Start() {
  addLoadingSpinner();

  await getGenres();
  await getMovies();

  removeLoadingSpinner();
}

// Page from pagination
export async function getMovies(page) {
  try {
    const { results, total_pages } = await movies.getTrendingMovies(page);
    console.log('results ', results);

    if (results.length === 0) {
      throw new Error(
        'Sorry, there are no movies matching your search query. Please try again.'
      );
    }

    console.log(results);

    clearFilmoteka();
    showMore.hide();

    markupFilmoteka(results);

    if (total_pages > 20 && page !== total_pages) {
      console.log(total_pages);
      showMore.show();
      showMore.enable();
    }
  } catch (error) {
    console.log(error.name);
    console.log(error.message);
  }
}
