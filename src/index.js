import Notiflix from "notiflix";
import ServiceImage from "./js/service-image";
import SimpleLightbox from "simplelightbox";
import { renderGallery } from "./js/render-gallery";

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more'),
}

refs.form.addEventListener('submit', onSearch);
refs.loadBtn.addEventListener('click', onLoadMore);

var lightbox = new SimpleLightbox('.gallery a');
const serviceImage = new ServiceImage();
let querry = "";

async function onSearch(evt) {
  evt.preventDefault();

  refs.gallery.innerHTML = '';
  serviceImage.resetPage();
  refs.loadBtn.classList.add("hidden");
  
  querry = evt.currentTarget.elements.searchQuery.value;
  const hits = await loadImages();

  refs.gallery.insertAdjacentHTML('beforeend', renderGallery(hits));
  setSmoothScroll();
  lightbox.refresh();
  refs.loadBtn.classList.remove("hidden");
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

    if (hits.length === 0) {
      throw new Error("Sorry, there are no images matching your search query. Please try again.");
    }
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