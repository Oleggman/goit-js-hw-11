import Notiflix from "notiflix";
import ServiceImage from "./js/service-image";
import SimpleLightbox from "simplelightbox";
import { renderGallery } from "./js/render-gallery";

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more'),
}

refs.loadBtn.style.display = "none";
refs.form.addEventListener('submit', onSearch);
refs.loadBtn.addEventListener('click', onLoadMore);

var lightbox = new SimpleLightbox('.gallery a');
const serviceImage = new ServiceImage();
let querry = "";

async function onSearch(evt) {
  evt.preventDefault();
  if (evt.currentTarget.elements.searchQuery.value === querry) {
    Notiflix.Notify.failure(`Querry ${querry} had been already declared. Enter something else...`);
    return;
  }

  refs.gallery.innerHTML = '';
  serviceImage.resetPage();
  refs.loadBtn.style.display = "none";
  
  querry = evt.currentTarget.elements.searchQuery.value;
  const hits = await loadImages();

  refs.gallery.insertAdjacentHTML('beforeend', renderGallery(hits));
  setSmoothScroll();
  lightbox.refresh();
  refs.loadBtn.style.display = "block";
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