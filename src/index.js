import Notiflix from "notiflix";
import ServiceImage from "./js/service-image";
import SimpleLightbox from "simplelightbox";
import { renderGallery } from "./js/render-gallery";

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  guard: document.querySelector('.js-guard')
}

refs.form.addEventListener('submit', onSearch);

var lightbox = new SimpleLightbox('.gallery a');
const serviceImage = new ServiceImage();
let querry = "";

const options = {
  rootMargin: "300px",
}
const observer = new IntersectionObserver(onLoadMore, options);

async function onSearch(evt) {
  evt.preventDefault();
  if (evt.currentTarget.elements.searchQuery.value === querry) {
    Notiflix.Notify.failure(`Querry ${querry} had been already declared. Enter something else...`);
    return;
  }

  refs.gallery.innerHTML = '';
  serviceImage.resetPage();
  
  querry = evt.currentTarget.elements.searchQuery.value;
  const hits = await loadImages();

  refs.gallery.insertAdjacentHTML('beforeend', renderGallery(hits));
  setSmoothScroll();
  lightbox.refresh();
  observer.observe(refs.guard);
}

async function onLoadMore() {
  const hits = await loadImages();

  refs.gallery.insertAdjacentHTML('beforeend', renderGallery(hits));
  lightbox.refresh();
}

async function loadImages() {
  let hits = null;
  try {
    hits = await serviceImage.fetchImage(querry);

  } catch (error) {    
    Notiflix.Notify.failure(error.message);
    querry = "";
    observer.unobserve(refs.guard);
  }

  serviceImage.nextPage();
  return hits;
}

function setSmoothScroll() {
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}