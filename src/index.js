import Notiflix from "notiflix";
import ServiceImage from "./js/service-image";
import { renderGallery } from "./js/render-gallery";

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
}

refs.form.addEventListener('submit', onSearch);
const serviceImage = new ServiceImage();

async function onSearch(evt) {
  evt.preventDefault();
  refs.gallery.innerHTML = '';
  const value = evt.currentTarget.elements.searchQuery.value;
  let hits = null;
  
  try {
    hits = await serviceImage.fetchImage(value);

    if (hits.length === 0) {
      throw new Error("Sorry, there are no images matching your search query. Please try again.");
    }
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }

  refs.gallery.innerHTML = renderGallery(hits);
}