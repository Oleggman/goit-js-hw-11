import axios from "axios";

axios.defaults.baseURL = 'https://pixabay.com/api/';

export default class ServiceImage {
  constructor(perPage) {
    this.API_URL = 'https://pixabay.com/api';
    this.API_KEY = '39209629-f3132ec928ad5cd36f2b712c3';
    this.page = 1;
    this.perPage = perPage;
  }

  async fetchImage(querry) {
    const params = new URLSearchParams({
      q: querry,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
      page: this.page,
      per_page: this.perPage,
    });

    const key = `?key=${this.API_KEY}`;
    const { data } = await axios.get(key, { params });
    return data;
  }

  nextPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get getPage() {
    return this.page;
  }
}
