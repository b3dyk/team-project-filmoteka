<<<<<<< Updated upstream
import { Movies } from './fetch';

const APIKey = 'e0e51fe83e5367383559a53110fae0e8';

const refs = {
  searchForm: document.querySelector('#search-form'),
  filmotekaList: document.querySelector('#filmoteka-list'),
};

let GENRES = [0];

Start();

async function Start() {
  await getGenres();

  await getMovies();
}

async function getMovies() {
  const movies = new Movies(APIKey);

  try {
    const moviesArr = await movies.getTrendingMovies();
    console.log('moviesArr ', moviesArr);

    if (moviesArr.length === 0) {
      throw new Error(
        'Sorry, there are no movies matching your search query. Please try again.'
      );
    }

    markupFilmoteka(moviesArr.results);
  } catch (error) {
    console.log(error.message);
  }
}

function markupFilmoteka(dataArr) {
  refs.filmotekaList.insertAdjacentHTML(
    'beforeend',
    dataArr.map(markupCard).join('')
  );
}

function markupCard(imgObj) {
  const base_url = 'https://image.tmdb.org/t/p/';
  // const file_size = 'original';
  const file_size = 'w500';
  const URI = `${base_url}${file_size}${imgObj.poster_path}`;
  const date = new Date(imgObj.release_date);

  const genres = markupGenres(imgObj.genre_ids);

  return `<li class="grid__item filmoteka__item">
			<div class="card" data-id="${imgObj.id}">
                <div class="card__img">
					<img src="${URI}" alt="${imgObj.title}">
				</div>
                    <div class="card__wrapper">
                        <h2 class="card__title title">${imgObj.title}</h2>
                        <p class="card__desc">${genres} | ${date.getFullYear()}
                        </p>
                    </div>
                </div>
			</li>
    `;
}

function markupGenres(genre_ids) {
  let genres = [];

  for (let i = 0; i < genre_ids.length; i++) {
    for (let j = 0; j < GENRES.length; j++) {
      const genre = GENRES[j];
      if (genre.id === genre_ids[i]) {
        genres.push(genre.name);
        continue;
      }
    }
  }

  return genres.join(', ');
}

async function getGenres() {
  const movies = new Movies(APIKey);
  try {
    GENRES = await movies.getGenres();
    console.log('GENRES ', GENRES);
  } catch (error) {
    console.log(error.message);
  }
}

function clearFilmoteka() {
  refs.filmotekaList.innerHTML = '';
=======
import 

let page = 1;

if (refs.formSearch) {
  refs.formSearch.addEventListener('submit', onFormSubmit);
}

export async function onFormSubmit(e) {
  e.preventDefault();
  spinnerPlay();

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
  spinnerStop();
}

function notification() {
  refs.notification.textContent =
    'Search result not successful. Enter the correct movie name and try again.';
>>>>>>> Stashed changes
}
