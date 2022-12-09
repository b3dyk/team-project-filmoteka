import { Movies } from './fetch';
import * as basicLightbox from 'basiclightbox';
import { APIKey } from './apikey';
import createBtnWatched from './watched-create-btn';
import createBtnQueue from './queue-create-btn';
import { addLibraryListWatched } from './watched';
import { addLibraryListQueue } from './queue';
import foto from '../images/poster/poster-not-found-desk.jpg';
const bodyScrollLock = require('body-scroll-lock');

export default class ModalMovie {
  constructor(
    {
      containerMain,
      containerMyLib,
      btnClose,
      openModal,
      modalContent,
      backdrop,
      header,
    },
    IMAGE_URL,
    APIKey
  ) {
    this.containerMain = containerMain;
    this.containerMyLib = containerMyLib;
    this.btnClose = btnClose;
    this.openModal = openModal;
    this.modalContent = modalContent;
    this.backdrop = backdrop;
    this.header = header;
    this.IMAGE_URL = IMAGE_URL;
    this.APIKey = APIKey;
  }
  init() {
    this.addEventListeners();
  }
  addEventListeners() {
    const isHeaderMain = refs.header.classList.contains('header--home');
    if (isHeaderMain) {
      this.containerMain.addEventListener('click', this.onOpenModal.bind(this));
    } else {
      this.containerMyLib.addEventListener(
        'click',
        this.onOpenModal.bind(this)
      );
    }
    this.btnClose.addEventListener('click', this.onCloseModal.bind(this));
    this.backdrop.addEventListener('click', this.toCloseModalClickBackdrop.bind(this));
  }

  async fetchMovie(movie) {
    const movies = new Movies(this.APIKey);
    return await movies.getMovieDetails(movie);
  }

  onOpenModal(e) {
    if (e.target.nodeName === 'UL') {
      return;
    }
    this.openModal.classList.remove('is-hidden');
    const movieId = e.target.closest('.filmoteka__item').dataset.id;

    bodyScrollLock.disableBodyScroll(document.body);
    const isBackdrop = !this.backdrop.classList.contains('is-hidden');
    if (isBackdrop) {
      window.addEventListener(
        'keydown',
        this.toCloseModalClickEscape.bind(this)
      );
    }
    this.onOpenInformationMovie(movieId);
  }

  getMovieDetals(movie) {
    this.fetchMovie(movie)
      .then(data => {
        this.onMakeMarkupModal(data);
      })
      .catch(error => {
        console.log(error.name);
        console.log(error.message);
      });
  }
  onOpenInformationMovie(movieId) {
    const watchedMovies = JSON.parse(localStorage.getItem('watched'));
    const queueedMovies = JSON.parse(localStorage.getItem('queue'));

    if (watchedMovies) {
      const movieLocalStorage = watchedMovies.find(item => item.id === Number(movieId));
      if (movieLocalStorage) {
        this.onMakeMarkupModal(movieLocalStorage);
        return
      }
    }
    if (queueedMovies) {
      const movieLocalStorage = queueedMovies.find(item => item.id === Number(movieId));
      if (movieLocalStorage) {
        this.onMakeMarkupModal(movieLocalStorage);
        return
      }
    }
    this.getMovieDetals(movieId)
  }
  toCloseModalClickEscape(e) {
    const isEscape = e.code === 'Escape';
    if (isEscape) {
      this.onCloseModal();
      window.removeEventListener(
        'keydown',
        this.toCloseModalClickEscape.bind(this)
      );
    }
  }
  toCloseModalClickBackdrop(e) {
    const isClickBackdrop = e.target === this.backdrop;
    if (isClickBackdrop) {
      this.onCloseModal();
    }
  }
  onCloseModal() {
    if (document.querySelector('#watched-btn')) {
      if (
        document.querySelector('#watched-btn').classList[0] ===
        'button--active' ||
        document.querySelector('#watched-btn').classList[1] ===
        'button--active' ||
        document.querySelector('#watched-btn').classList[2] === 'button--active'
      ) {
        addLibraryListWatched();
      }
      if (
        document.querySelector('#queue-btn').classList[0] ===
        'button--active' ||
        document.querySelector('#queue-btn').classList[1] ===
        'button--active' ||
        document.querySelector('#queue-btn').classList[2] === 'button--active'
      ) {
        addLibraryListQueue();
      }
    }
    this.openModal.classList.add('is-hidden');
    this.modalContent.innerHTML = '';
    bodyScrollLock.enableBodyScroll(document.body);
  }

  onMakeMarkupModal(data) {
    let {
      poster_path,
      title,
      vote_average,
      vote_count,
      popularity,
      original_title,
      genres,
      overview,
      id,
    } = data;

    let img = `${this.IMAGE_URL}${poster_path}`;
    if (!poster_path) {
      img = foto;
    }

    if (!overview.length) {
      overview = 'There is no description';
    }
    if (!genres.length) {
      genres = [
        {
          id: 0,
          name: 'No information',
        },
      ];
    }
    genres = genres.map(item => item.name).join(', ');
    vote_average = vote_average.toFixed(1);
    popularity = popularity.toFixed(1);

    const markup = `
    <div class="movie-details__preview-wrapper" data-id="${id}">
        <img class="movie-details__img" src="${img}"/>
      <button class="button movie-details__button-trailer modal__button visually-hidden" data-trailer type="button">Show trailer</button>
    </div>
  <div class="movie-details__thumb">
    <div class="movie-details__content"><h3 class="movie-details__title">${title}</h3>
      <table><tbody class="table"><tr>
        <td class="movie-details__name">Vote / Votes</td><td class="movie-details__slash"><span class="movie-details__vote movie-details__vote--average">${vote_average}</span> / <span class="movie-details__vote">${vote_count}</span></td>
      </tr><tr>
          <td class="movie-details__name">Popularity</td><td class="movie-details__value">${popularity}</td>
        </tr><tr>
          <td class="movie-details__name">Original Title</td><td class="movie-details__value">${original_title}</td>
        </tr><tr>
          <td class="movie-details__name">Genres</td><td class="movie-details__genres">${genres}</td>
        </tr></tbody></table>
      <h4 class="movie-details__about">ABOUT</h4>
      <p class="movie-details__text">${overview}</p></div>
    <div class="movie-details__buttons">
      <button class="button modal__button" type="button" id="modal__watched-button">Add to Watched</button>
      <button id="modal__button-queue" class="button modal__button" type="button">Add to Queue</button>
    </div>
  </div>
`;
    this.modalContent.insertAdjacentHTML('beforeend', markup);

    createBtnWatched(id);
    createBtnQueue(id);

    this.startListenTrailerClick(id);
  }

  async startListenTrailerClick(id) {
    const trailerRun = this.modalContent.querySelector('[data-trailer]');

    const movies = new Movies(this.APIKey);
    const { results } = await movies.getMovieTrailers(id);
    // Якщо немає результатів, то нічого не робимо
    if (!results.length) return;

    const youTubeVideo = results.find(
      vid => vid.site === 'YouTube' && vid.type === 'Trailer'
    );


    // Якщо немає трейлерів, то нічого не робимо
    if (!youTubeVideo) return;
    trailerRun.classList.remove('visually-hidden');
    trailerRun.addEventListener('click', async () => {
      const instance = basicLightbox.create(`
  < iframe src = "https://www.youtube.com/embed/${youTubeVideo.key}" width = "560" height = "315" frameborder = "0" ></ >
    `);

      instance.show();
    });
  }
}

const getRef = x => document.querySelector(x);
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const refs = {
  containerMain: getRef('#filmoteka-list'),
  containerMyLib: getRef('.library__list'),
  btnClose: getRef('button[data-modal="close"]'),
  openModal: getRef('[data-modal="open"]'),
  modalContent: getRef('.movie-details'),
  backdrop: getRef('.backdrop'),
  header: getRef('.header'),
};

new ModalMovie(refs, IMAGE_URL, APIKey).init();
