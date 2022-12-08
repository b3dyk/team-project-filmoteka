import Pagination from 'tui-pagination';
// import 'tui-pagination/dist/tui-pagination.css';
import { getTrendMovies, getAppendMovies } from './gallery';
import moveUp from './move-up';
import refs from './refs';
import { Movies } from './fetch';
import { markupFilmoteka, APIKey } from './markup';
import ShowMore from './show-more-btn';

const movies = new Movies(APIKey);

export const showMore = new ShowMore({ selector: '.show-more', hidden: true });

export function makePaginationOptions(totalResults = 10000, currentPage = 1) {
  return {
    totalItems: totalResults,
    itemsPerPage: 20,
    visiblePages: 5,
    page: currentPage,
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

  console.log('currentPageStart -->', currentPageStart);

  await getTrendMovies(currentPageStart);

  moveUp();
}
