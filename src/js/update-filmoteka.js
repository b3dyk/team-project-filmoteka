import { initTrendMoviesList } from './gallery';
import { initWatchedMoviesList } from './watched';
import refs from './refs';
import { initTrendPagination } from './pagination';

start();
async function start() {
  const isHeaderMain = refs.header.classList.contains('header--home');
  const isHeaderLib = refs.header.classList.contains('header--mylib');

  // Ініціалізація підвантаження трендових фільмів і пагінація
  if (isHeaderMain) {
    const totalResults = await initTrendMoviesList();

    initTrendPagination(totalResults);
  }

  //Ще не реалізовано
  if (isHeaderLib) {
    console.log('isHeaderLib ', isHeaderLib);
    initWatchedMoviesList();
  }
}
