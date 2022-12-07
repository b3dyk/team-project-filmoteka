import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

import { Movies } from './fetch';
import { getMovies, getAppendMovies } from './gallery';
import { markupFilmoteka } from './markup';
import moveUp from './move-up';
import refs from './refs';
import ShowMore from './show-more-btn';

const APIKey = 'e0e51fe83e5367383559a53110fae0e8';

const movies = new Movies(APIKey);

// Додаємо екземпляр кнопки "Show more". Її спочатку не видно, але вона з'являється, якщо з бекенду приходить більше 20 фільмів. Умова прописана у функції getMovies()
const showMore = new ShowMore({ selector: '.show-more', hidden: true });

// Додаємо об'єкт, у якому ключ nextPage буде змінюватись і його значення буде динамічно підставлятися у options.page (це дає можливість при кожній зміні номера сторінки робити цю сторінку АКТИВНОЮ у пагінації)
// Метод об'єкту addNextTrendingMovies() підтягує наступний масив фільмів і промальовує картки фільмів.

export const nextOptions = {
  nextPage: 1,
  async addNextTrendingMovies() {
    try {
      this.nextPage += 1;
      const { results, total_pages } = await movies.getTrendingMovies(
        this.nextPage
      );
      markupFilmoteka(results);
      showMore.enable();

      if (total_pages === this.nextPage) {
        showMore.hide();
      }
    } catch (error) {
      console.log(error.name, error.message);
    }
  },
};

const container = document.getElementById('pagination');

console.log(nextOptions.nextPage);

function makePaginationOptions(totalResults = 20000) {
  return {
    totalItems: totalResults,
    itemsPerPage: 20,
    visiblePages: 5,
    page: nextOptions.nextPage,
    centerAlign: true,
    firstItemClassName: 'tui-first-child',
    lastItemClassName: 'tui-last-child',
    template: {
      page: '<a href="#" class="tui-page-btn">{{page}}</a>',
      currentPage:
        '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
      moveButton:
        '<a href="#" class="tui-page-btn tui-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
        '</a>',
      disabledMoveButton:
        '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
        '</span>',
      moreButton:
        '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
        '<span class="tui-ico-ellip">...</span>' +
        '</a>',
    },
  };
}

const paginationOptions = makePaginationOptions();

export const paginationStart = new Pagination(
  refs.paginationContainer,
  paginationOptions
);

paginationStart.on('afterMove', updateMoviesList);

export async function updateMoviesList(event) {
  const currentPageStart = event.page;
  nextOptions.nextPage = currentPageStart;

  await getMovies(currentPageStart);

  moveUp();
}

showMore.refs.blockShowMore.addEventListener('click', onShowMoreClick);

export function updateMoviesList2(event) {
  console.log('event.page -->', event.page);

  nextOptions.nextPage = event.page;
  console.log('nextPage in updateMoviesList -->', nextOptions.nextPage);

  getAppendMovies(event.page);
}

async function onShowMoreClick() {
  showMore.disable();

  await nextOptions.addNextTrendingMovies(pagination._currentPage);

  pagination.off();
  pagination.on('afterMove', updateMoviesList2);
  pagination.movePageTo(nextOptions.nextPage);
  console.log('nextPage after showMore -->', nextOptions.nextPage);
  pagination.off();
  pagination.on('afterMove', updateMoviesList);
}
