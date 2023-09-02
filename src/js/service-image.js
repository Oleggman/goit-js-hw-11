import axios from "axios";
import Notiflix from "notiflix";

class ServiceImage {
  constructor() {
    this.API_URL = 'https://pixabay.com/api';
    this.API_KEY = '39209629-f3132ec928ad5cd36f2b712c3';
    this.page = 1;
    this.perPage = 40;
    this.hits = null;
    this.setHits = false;
  }

  async fetchImage(querry) {
    const params = new URLSearchParams({
      key: this.API_KEY,
      q: querry,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
      page: this.page,
      per_page: this.perPage,
    });

    let response = null;
    try {
      response = await axios(`${this.API_URL}?${params}`);
      if (!this.setHits && response.data.hits.length) {
        this.hits = response.data.totalHits;
        this.setHits = true;
        Notiflix.Notify.success(`Hooray! We found ${this.hits} images.`);
      } 
    } catch (error) {
      if (this.page * this.perPage > this.hits) {
        throw new Error("We're sorry, but you've reached the end of search results.");
      }
      
      throw error;
    }
    
    if (!response.data.hits.length) {
      throw new Error("Sorry, there are no images matching your search query. Please try again.")
    }
      
    return response.data.hits;
  }

  nextPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
    this.setHits = false;
    this.hits = 0;
  }
}

export default ServiceImage;
