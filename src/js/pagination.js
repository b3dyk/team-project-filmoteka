import Pagination from 'tui-pagination';
// import 'tui-pagination/dist/tui-pagination.css';
import { initTrendMoviesList } from './gallery';
import { initSearchMoviesList } from './search';
import moveUp from './move-up';
import refs from './refs';

function makePaginationOptions(totalResults = 10000) {
  return {
    totalItems: totalResults,
    itemsPerPage: 20,
    visiblePages: 5,
    page: 1,
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

export function initTrendPagination(totalResults) {
  const options = makePaginationOptions(totalResults);

  const pagination = new Pagination(refs.paginationContainer, options);
  // pagination.reset();
  pagination.on('afterMove', updateTrendMoviesList);
}

export function initSearchPagination(totalResults) {
  const options = makePaginationOptions(totalResults);

  const pagination = new Pagination(refs.paginationContainer, options);
  // pagination.reset();
  pagination.on('afterMove', updateSearchMoviesList);
}

async function updateTrendMoviesList(event) {
  const currentPage = event.page;

  console.log('currentPage -->', currentPage);

  await initTrendMoviesList(currentPage);

  moveUp();
}

async function updateSearchMoviesList(event) {
  const currentPage = event.page;
  const query = refs.searchForm.elements.searchQuery.value;

  console.log('currentPage -->', currentPage);

  await initSearchMoviesList(query, currentPage);

  moveUp();
}
