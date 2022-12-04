import { refs } from './refs';
import { clearGallery } from './supportFunctions';
import { getSearchMovies, renderMoviesGallery } from './API/search-movies';

let page = 1;

if (refs.formSearch) {
  refs.formSearch.addEventListener('submit', onFormSubmit);
}

export async function onFormSubmit(e) {
  e.preventDefault();

  refs.notification.textContent = '';

  const searchResult = e.target.elements.searchQuery.value.trim().toLowerCase();

  if (searchResult) {
    const storageValue = JSON.stringify(searchResult);
    localStorage.setItem('searchValue', storageValue);
    const storagePage = JSON.stringify(page);
    localStorage.setItem('page', storagePage);
    try {
      const markupPictures = await getSearchMovies(searchResult, page);

      if (markupPictures.length) {
        clearGallery(refs.galleryMovies);
        renderMoviesGallery(markupPictures, refs.galleryMovies);
      } else {
        notification();
      }
    } catch (error) {
      notification();
    }
  } else {
    notification();
  }
}

function notification() {
  refs.notification.textContent =
    'Search result not successful. Enter the correct movie name and try again.';
}
