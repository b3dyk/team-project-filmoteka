import { Movies } from './fetch';
import { APIKey } from './apikey';
import { markupMyLibrary } from './markup';

const refs = {
  header: document.querySelector('.header'),
  modal: document.querySelector('.modal'),
  libraryList: document.querySelector('#library-list'),
  queueBtn: document.querySelector('#queue-btn'),
  watchedBtn: document.querySelector('#watched-btn'),
};

refs.modal.addEventListener('click', addToQueue);

let queueFilm = [];
let queueFilmId = [];
const isMyLibMain = refs.header.classList.contains('header--mylib');
if (isMyLibMain) {
  Start();
  refs.queueBtn.addEventListener('click', addLibraryListQueue);
}

async function Start() {
  checkQueue();
}

async function addToQueue(event) {
  if (
    event.target.nodeName !== 'BUTTON' ||
    event.target.id !== 'modal__button-queue'
  ) {
    return;
  }

  const movies = new Movies(APIKey);
  checkQueue();

  if (event.target.classList[1] === 'modal__button--active') {
    event.target.textContent = 'add to Queue';
    event.target.classList.add('modal__button');
    event.target.classList.remove('modal__button--active');

    const namberFilm = queueFilmId.indexOf(
      JSON.parse(event.target.offsetParent.children[2].children[0].dataset.id)
    );

    queueFilmId.splice(namberFilm, 1);
    queueFilm.splice(namberFilm, 1);

    localStorage.setItem('queueId', JSON.stringify(queueFilmId));
    localStorage.setItem('queue', JSON.stringify(queueFilm));
    return;
  }

  if (event.target.offsetParent.children[2].children[0].dataset.id) {
    event.target.textContent = 'remove from queue';
    event.target.classList.remove('modal__button');
    event.target.classList.add('modal__button--active');
  }

  try {
    const film = await movies.getMovieDetails(
      event.target.offsetParent.children[2].children[0].dataset.id
    );
    if (!queueFilmId.includes(film.id)) {
      queueFilmId.push(film.id);
      queueFilm.push(film);

      localStorage.setItem('queueId', JSON.stringify(queueFilmId));
      localStorage.setItem('queue', JSON.stringify(queueFilm));
    }
  } catch (error) {
    console.log(error.message);
  }
}

function checkQueue() {
  if (localStorage.getItem('queue')) {
    queueFilm = JSON.parse(localStorage.getItem('queue'));
    queueFilmId = JSON.parse(localStorage.getItem('queueId'));
  }
}

export async function addLibraryListQueue() {
  try {
    refs.libraryList.innerHTML = '';
    refs.queueBtn.classList.add('button--active');
    refs.watchedBtn.classList.remove('button--active');
  } catch (error) {}

  if (localStorage.getItem('queue')) {
    markupMyLibrary(queueFilm);
    // for (const film of queueFilm) {
    //   try {
    //     refs.libraryList.insertAdjacentHTML('beforeend', markupCardLib(film));
    //   } catch (error) {}
    // }
  }
}

// function markupCard(imgObj) {
//   const URI = `https://image.tmdb.org/t/p/w500${imgObj.poster_path}`;
//   const date = new Date(imgObj.release_date);
//   const genres = markupGenres(imgObj.genres);

//   return `<li class="grid__item filmoteka__item" data-id="${imgObj.id}">
// 			<div class="card" data-id="${imgObj.id}">
//                 <div class="card__img">
// 					<img src="${URI}" alt="${imgObj.title}">
// 				</div>
//                     <div class="card__wrapper">
//                         <h2 class="card__title title">${imgObj.title}</h2>
//                         <p class="card__desc">${genres} | ${date.getFullYear()}
//                         <span class="card__vote">
//                             ${imgObj.vote_average.toFixed(1)}
//                         </span>
//                         </p>
//                     </div>
//                 </div>
// 			</li>`;
// }

// function markupGenres(genre_ids) {
//   let genres = [];
//   for (const genre of genre_ids) {
//     genres.push(genre.name);
//   }
//   return genres.join(', ');
// }

// async function getGenres() {
//   const movies = new Movies(APIKey);
//   try {
//     GENRES = await movies.getGenres();
//   } catch (error) {
//     console.log(error.message);
//   }
// }
