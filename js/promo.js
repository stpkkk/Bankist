'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const buttonScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Add a cookie message
const header = document.querySelector('.header');
const message = document.createElement('div');
message.classList.add('cookie');
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
header.prepend(message);
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', () => message.remove());
message.style.background = '#37383d';
message.style.width = '120%';

//Button scrolling
buttonScrollTo.addEventListener('click', () => {
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

//Page Navigation
// document.querySelectorAll('.nav__link').forEach(el => {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href'); //this === el
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//     console.log(id);
//   });
// });

//1. Add eventListener to common parent element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  //2. Determine what element originated the event
  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
