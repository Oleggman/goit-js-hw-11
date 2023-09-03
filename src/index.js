import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import ServiceImage from "./js/service-image";
import { renderGallery } from "./js/render-gallery";
import { refs } from "./js/refs";

var lightbox = new SimpleLightbox('.gallery a');
refs.form.addEventListener('submit', onSearch);

const perPage = 40;
const serviceImage = new ServiceImage(perPage);
let totalHits = null;
let querry = "";

const observer = new IntersectionObserver(onLoadMore, { rootMargin: "300px" });

async function onSearch(evt) {
  evt.preventDefault();
  if (evt.currentTarget.elements.searchQuery.value === querry) {
    Notiflix.Notify.failure(`Querry ${querry} had been already declared. Enter something else...`);
    return;
  }
  
  refs.gallery.innerHTML = '';
  serviceImage.resetPage();
  querry = evt.currentTarget.elements.searchQuery.value;
  
  let data = null;
  try {
    data = await serviceImage.fetchImage(querry);
    if (!data.hits.length) {
      throw new Error("Sorry, there are no images matching your search query. Please try again.");
    }
    totalHits = data.totalHits;
  } catch (error) {    
    Notiflix.Notify.failure(error.message);
    querry = "";
    return;
  }

  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  serviceImage.nextPage();
  
  evt.target.reset();
  refs.gallery.insertAdjacentHTML('beforeend', renderGallery(data.hits));
  lightbox.refresh();
  observer.observe(refs.guard);
  setSmoothScroll();
}

function onLoadMore(entries) {
  entries.forEach(async (entry) => {
    if (entry.isIntersecting) {
      let data = null;
      try {
        data = await serviceImage.fetchImage(querry);
        if (!data.hits.length) {
          throw new Error("We're sorry, but you've reached the end of search results.");
        }
      } catch (error) { 
        if (serviceImage.getPage * perPage > totalHits) {
          Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        } else {
           Notiflix.Notify.failure(error.message);
        }
        
        observer.unobserve(refs.guard);
        return;
      }

      serviceImage.nextPage();

      refs.gallery.insertAdjacentHTML('beforeend', renderGallery(data.hits));
      lightbox.refresh();
    }
  })
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
