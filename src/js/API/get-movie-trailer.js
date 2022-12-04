import axios from 'axios';
import { KEY_API } from './api-params';
import { refs } from '../refs';

// функція HTTP запиту
axios.defaults.baseURL = 'https://api.themoviedb.org/3';
axios.defaults.params = {
  api_key: KEY_API,
};

const trailerPlayerRef = document.querySelector('.modal-trailer');

async function fetchMovieTrailer(movieId) {
  try {
    const res = await axios.get(`/movie/${movieId}/videos`);
    return res.data.results;
  } catch (e) {
    return console.error(e);
  }
}

// функція отримання даних про трейлер
async function getTrailers(movieId) {
  const results = await fetchMovieTrailer(movieId);
  const officialTrailer = results.find(trailer => trailer.official === true);

  return officialTrailer;
}

// функція рендеру кнопоки для модалки
export async function renderTrailerBtn(movieId, selector) {
  const officialTrailer = await getTrailers(movieId);
  if (!officialTrailer) {
    return;
  }
  selector.classList.remove('is-hidden');
}

export function renderBtn() {
  const selector = document.querySelectorAll('.watch-trailer-btn-gallery');
  selector.forEach(element => {
    renderTrailerBtn(element.dataset.id, element);
  });
}
