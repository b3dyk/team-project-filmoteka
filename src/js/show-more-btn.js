// const refs = {
//   blockShowMore: document.querySelector('.show-more'),
//   iconShowMore: document.querySelector('.show-more__icon'),
//   textShowMore: document.querySelector('.show-more__text'),
// };

// function displayShowMore() {
//   refs.blockShowMore.style.display = 'flex';
// }

// function addMoreIconRotate() {
//   refs.iconShowMore.classList.add('rotated');
//   refs.textShowMore.style.opacity = '0.5';
//   refs.textShowMore.textContent = 'Wait...';
// }

// function removeMoreIconRotate() {
//   refs.iconShowMore.classList.remove('rotated');
//   refs.textShowMore.style.opacity = '1';
//   refs.textShowMore.textContent = 'Show more';
// }

export default class ShowMore {
  constructor({ selector, hidden = false }) {
    this.refs = this.getRefs(selector);
    hidden && this.hide();
    //   if (hidden) {
    //       this.hide();
    //   }
  }

  getRefs(selector) {
    const refs = {};
    refs.blockShowMore = document.querySelector(selector);
    refs.iconShowMore = refs.blockShowMore.querySelector('.show-more__icon');
    refs.textShowMore = refs.blockShowMore.querySelector('.show-more__text');

    return refs;
  }

  enable() {
    this.refs.iconShowMore.classList.remove('rotated');
    this.refs.textShowMore.style.opacity = '1';
    this.refs.textShowMore.textContent = 'Show more';
  }

  disable() {
    this.refs.iconShowMore.classList.add('rotated');
    this.refs.textShowMore.style.opacity = '0.5';
    this.refs.textShowMore.textContent = 'Wait...';
  }

  show() {
    this.refs.blockShowMore.style.display = 'flex';
  }

  hide() {
    this.refs.blockShowMore.style.display = 'none';
  }
}
